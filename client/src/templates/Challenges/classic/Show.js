import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import { first } from 'lodash';
import Media from 'react-responsive';

import LearnLayout from '../../../components/layouts/Learn';
import Editor from './Editor';
import Preview from '../components/Preview';
import SidePanel from '../components/Side-Panel';
import Output from '../components/Output';
import CompletionModal from '../components/CompletionModal';
import HelpModal from '../components/HelpModal';
import VideoModal from '../components/VideoModal';
import ResetModal from '../components/ResetModal';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

import { createGuideUrl } from '../utils';
import { challengeTypes } from '../../../../utils/challengeTypes';
import { ChallengeNode } from '../../../redux/propTypes';
import { dasherize } from '../../../../utils';
import {
  createFiles,
  challengeFilesSelector,
  challengeTestsSelector,
  initConsole,
  initTests,
  updateChallengeMeta,
  challengeMounted,
  consoleOutputSelector
} from '../redux';

import './classic.css';
import '../components/test-frame.css';

const mapStateToProps = createStructuredSelector({
  files: challengeFilesSelector,
  tests: challengeTestsSelector,
  output: consoleOutputSelector
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createFiles,
      initConsole,
      initTests,
      updateChallengeMeta,
      challengeMounted
    },
    dispatch
  );

const propTypes = {
  challengeMounted: PropTypes.func.isRequired,
  createFiles: PropTypes.func.isRequired,
  data: PropTypes.shape({
    challengeNode: ChallengeNode
  }),
  files: PropTypes.shape({
    key: PropTypes.string
  }),
  initConsole: PropTypes.func.isRequired,
  initTests: PropTypes.func.isRequired,
  output: PropTypes.string,
  pageContext: PropTypes.shape({
    challengeMeta: PropTypes.object
  }),
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      testString: PropTypes.string
    })
  ),
  updateChallengeMeta: PropTypes.func.isRequired
};

const MAX_MOBILE_WIDTH = 767;

class ShowClassic extends Component {
  constructor() {
    super();

    this.resizeProps = {
      onStopResize: this.onStopResize.bind(this),
      onResize: this.onResize.bind(this)
    };

    this.state = {
      resizing: false
    };
  }
  onResize() {
    this.setState({ resizing: true });
  }

  onStopResize() {
    this.setState({ resizing: false });
  }

  componentDidMount() {
    const {
      data: {
        challengeNode: { title }
      }
    } = this.props;
    this.initializeComponent(title);
  }

  componentDidUpdate(prevProps) {
    const {
      data: {
        challengeNode: { title: prevTitle }
      }
    } = prevProps;
    const {
      data: {
        challengeNode: { title: currentTitle }
      }
    } = this.props;
    if (prevTitle !== currentTitle) {
      this.initializeComponent(currentTitle);
    }
  }

  initializeComponent(title) {
    const {
      challengeMounted,
      createFiles,
      initConsole,
      initTests,
      updateChallengeMeta,
      data: {
        challengeNode: {
          files,
          fields: { tests },
          challengeType
        }
      },
      pageContext: { challengeMeta }
    } = this.props;
    initConsole('');
    createFiles(files);
    initTests(tests);
    updateChallengeMeta({ ...challengeMeta, title, challengeType });
    challengeMounted(challengeMeta.id);
  }

  componentWillUnmount() {
    const { createFiles } = this.props;
    createFiles({});
  }

  getChallenge = () => this.props.data.challengeNode;

  getBlockNameTitle() {
    const {
      fields: { blockName },
      title
    } = this.getChallenge();
    return `${blockName}: ${title}`;
  }

  getGuideUrl() {
    const { forumTopicId, title } = this.getChallenge();
    return forumTopicId
      ? 'https://www.freecodecamp.org/forum/t/' + forumTopicId
      : createGuideUrl(title);
  }

  getVideoUrl = () => this.getChallenge().videoUrl;

  getChallengeFile() {
    const { files } = this.props;
    return first(Object.keys(files).map(key => files[key]));
  }

  hasPreview() {
    const { challengeType } = this.getChallenge();
    return (
      challengeType === challengeTypes.html ||
      challengeType === challengeTypes.modern
    );
  }

  renderInstructionsPanel({ showToolPanel }) {
    const {
      fields: { blockName },
      description,
      instructions
    } = this.getChallenge();

    const {
      introPath,
      nextChallengePath,
      prevChallengePath
    } = this.props.pageContext.challengeMeta;
    return (
      <SidePanel
        className='full-height'
        description={description}
        guideUrl={this.getGuideUrl()}
        instructions={instructions}
        introPath={introPath}
        nextChallengePath={nextChallengePath}
        prevChallengePath={prevChallengePath}
        section={dasherize(blockName)}
        showPrevNextBtns={true}
        showToolPanel={showToolPanel}
        title={this.getBlockNameTitle()}
        videoUrl={this.getVideoUrl()}
      />
    );
  }

  renderEditor() {
    const { files } = this.props;
    const challengeFile = first(Object.keys(files).map(key => files[key]));
    return (
      challengeFile && <Editor {...challengeFile} fileKey={challengeFile.key} />
    );
  }

  renderTestOutput() {
    const { output } = this.props;
    return (
      <Output
        defaultOutput={`
/**
* Your test output will go here.
*/
`}
        output={output}
      />
    );
  }

  renderPreview() {
    return (
      <Preview className='full-height' disableIframe={this.state.resizing} />
    );
  }

  render() {
    return (
      <LearnLayout>
        <Helmet
          title={`Learn ${this.getBlockNameTitle()} | freeCodeCamp.org`}
        />
        <Media maxWidth={MAX_MOBILE_WIDTH}>
          <MobileLayout
            editor={this.renderEditor()}
            guideUrl={this.getGuideUrl()}
            hasPreview={this.hasPreview()}
            instructions={this.renderInstructionsPanel({
              showToolPanel: false
            })}
            preview={this.renderPreview()}
            testOutput={this.renderTestOutput()}
            videoUrl={this.getVideoUrl()}
          />
        </Media>
        <Media minWidth={MAX_MOBILE_WIDTH + 1}>
          <DesktopLayout
            challengeFile={this.getChallengeFile()}
            editor={this.renderEditor()}
            hasPreview={this.hasPreview()}
            instructions={this.renderInstructionsPanel({
              showToolPanel: true
            })}
            preview={this.renderPreview()}
            resizeProps={this.resizeProps}
            testOutput={this.renderTestOutput()}
          />
        </Media>
        <CompletionModal />
        <HelpModal />
        <VideoModal videoUrl={this.getVideoUrl()} />
        <ResetModal />
      </LearnLayout>
    );
  }
}

ShowClassic.displayName = 'ShowClassic';
ShowClassic.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowClassic);

export const query = graphql`
  query ClassicChallenge($slug: String!) {
    challengeNode(fields: { slug: { eq: $slug } }) {
      title
      description
      instructions
      challengeType
      videoUrl
      forumTopicId
      fields {
        slug
        blockName
        tests {
          text
          testString
        }
      }
      required {
        link
        src
      }
      files {
        indexhtml {
          key
          ext
          name
          contents
          head
          tail
        }
        indexjs {
          key
          ext
          name
          contents
          head
          tail
        }
        indexjsx {
          key
          ext
          name
          contents
          head
          tail
        }
      }
    }
  }
`;
