const express = require('express');

var cors = require('cors');

var bodyParser = require('body-parser'); // parser for post requests
var AssistantV2 = require('ibm-watson/assistant/v2'); // watson sdk
const { IamAuthenticator, BearerTokenAuthenticator } = require('ibm-watson/auth');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1.js');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');



const app = express();
app.use(cors());

const textToSpeech = new TextToSpeechV1({
  version: '2018-04-05',
  authenticator: new IamAuthenticator({
    apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY || 'type-key-here',
  }),
  url: process.env.TEXT_TO_SPEECH_URL,
});

// Create the service wrapper

let authenticator;
if (process.env.ASSISTANT_IAM_APIKEY) {
  authenticator = new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY
  });
} else if (process.env.BEARER_TOKEN) {
  authenticator = new BearerTokenAuthenticator({
    bearerToken: process.env.BEARER_TOKEN
  });
}

var assistant = new AssistantV2({
  version: '2019-02-28',
  authenticator: authenticator,
  url: process.env.ASSISTANT_URL,
  disableSslVerification: process.env.DISABLE_SSL_VERIFICATION === 'true' ? true : false
});

// Create the service wrapper
const translator = new LanguageTranslatorV3({
  version: '2019-10-10',
  authenticator: new IamAuthenticator({
    apikey: process.env.LANGUAGE_TRANSLATOR_IAM_APIKEY,
  }),
  url: process.env.LANGUAGE_TRANSLATOR_URL,
  headers: {
    'X-Watson-Technology-Preview': '2018-05-01',
    'X-Watson-Learning-Opt-Out': true,
  },
});

// Bootstrap application settings
require('./config/express')(app);



const getFileExtension = (acceptQuery) => {
  const accept = acceptQuery || '';
  switch (accept) {
    case 'audio/ogg;codecs=opus':
    case 'audio/ogg;codecs=vorbis':
      return 'ogg';
    case 'audio/wav':
      return 'wav';
    case 'audio/mpeg':
      return 'mpeg';
    case 'audio/webm':
      return 'webm';
    case 'audio/flac':
      return 'flac';
    default:
      return 'mp3';
  }
};

app.get('/', (req, res) => {
  res.render('index');
});

/**
 * Pipe the synthesize method
 */
app.get('/api/v3/synthesize', async (req, res, next) => {
  try {
    console.log('request'+req);
    const { result } = await textToSpeech.synthesize(req.query);
    const transcript = result;
    transcript.on('response', (response) => {
      if (req.query.download) {
        response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
      }
    });
    transcript.on('error', next);
    transcript.pipe(res);
    console.log('response'+res);
  } catch (error) {
    res.send(error);
  }
});

// Return the list of voices
app.get('/api/v2/voices', async (req, res, next) => {
  try {
    const { result } = textToSpeech.listVoices();
    res.json(result);
  } catch (error) {
    next(error);
  }
});


// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  let assistantId = process.env.ASSISTANT_ID || '<assistant-id>';
  if (!assistantId || assistantId === '<assistant-id>') {
    return res.json({
      output: {
        text:
          'The app has not been configured with a <b>ASSISTANT_ID</b> environment variable. Please refer to the ' +
          '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' +
          'Once a workspace has been defined the intents may be imported from ' +
          '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.',
      },
    });
  }

  var textIn = '';

  if (req.body.input) {
    textIn = req.body.input.text;
  }

  var payload = {
    assistantId: assistantId,
    sessionId: req.body.session_id,
    input: {
      message_type: 'text',
      text: textIn,
    },
  };

  // Send the input to the assistant service
  assistant.message(payload, function(err, data) {
    if (err) {
      const status = err.code !== undefined && err.code > 0 ? err.code : 500;
      return res.status(status).json(err);
    }

    return res.json(data);
  });
});

app.get('/api/session', function(req, res) {
  console.log( process.env.ASSISTANT_ID)
  assistant.createSession(
    {
      assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
    },
    function(error, response) {
      if (error) {
        console.log(error);
        return res.send(error);
      } else {
        return res.send(response);
      }
    }
  );
});

app.get('/api/identifiable_languages', function(req, res, next) {
  console.log('/v3/identifiable_languages');
  translator
    .listIdentifiableLanguages(req.body)
    .then(({ result }) => res.json(result))
    .catch(error => next(error));
});
app.post('/api/identify', function(req, res, next) {
  console.log('/v3/identify');
  translator
    .identify(req.body)
    .then(({ result }) => res.json(result))
    .catch(error => next(error));
});
app.get('/api/models', function(req, res, next) {
  console.log('/v3/models');
  translator
    .listModels()
    .then(({ result }) => res.json(result))
    .catch(error => next(error));
});
app.post('/api/translate', function(req, res, next) {
  console.log('/v3/translate');
  translator
    .translate(req.body)
    .then(({ result }) => res.json(result))
    .catch(error => next(error));
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
