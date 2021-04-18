"use strict";

const AWS = require("aws-sdk");
const comprehend = new AWS.Comprehend();

module.exports.sentiment = async (event) => {
  console.info("event:", event);
  const text = JSON.parse(event.body);
  const validLanguages = [
    "ar",
    "hi",
    "ko",
    "zh-TW",
    "ja",
    "zh",
    "de",
    "pt",
    "en",
    "it",
    "fr",
    "es",
  ];

  const language = await comprehend
    .detectDominantLanguage({ Text: text })
    .promise();
  const languageCode = language.Languages[0].LanguageCode;

  const sentiment = await comprehend
    .detectSentiment({
      LanguageCode:
        validLanguages.indexOf(languageCode) > 0 ? languageCode : "en",
      Text: text,
    })
    .promise();

  let score = 0;
  switch (sentiment.Sentiment) {
    case "POSITIVE":
    default:
      score = sentiment.SentimentScore.Positive;
      break;
    case "NEGATIVE":
      score = sentiment.SentimentScore.Negative;
      break;
    case "NEUTRAL":
      score = sentiment.SentimentScore.Netural;
      break;
    case "MIXED":
      score = sentiment.SentimentScore.Mixed;
      break;
  }

  try {
    console.info("result:", result);

    const result = {
      statusCode: 200,
      body: JSON.stringify(
        {
          text,
          language,
          sentiment,
          score,
        },
        null,
        2
      ),
    };
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
