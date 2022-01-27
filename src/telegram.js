const { TelegramClient, Api } = require('telegram');
const { StoreSession } = require('telegram/sessions');
const input = require('input');
require('dotenv').config();

const SignalModel = require('./models/signal.model');
const signalModel = require('./models/signal.model');

const srcChannelId = process.env.SOURCE_CHANNEL_ID;
const desChannelId = process.env.DESTINATION_CHANNEL_ID;
const apiId = Number.parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const storeSession = new StoreSession('my_session');

const client = new TelegramClient(storeSession, apiId, apiHash, {
  connectionRetries: 5,
});

async function bootstrapTelegram() {
  await client.start({
    phoneNumber: process.env.PHONE_NUMBER,
    password: async () => await input.text('password?'),
    phoneCode: async () => await input.text('Code ?'),
    onError: (err) => console.log(err),
  });
  client.session.save();

  client.addEventHandler(handleSrcMsg);
}

async function sendMsgToDes(msg, replyToMsgId) {
  return client.invoke(
    new Api.messages.SendMessage({
      peer: new Api.PeerChannel({
        channelId: BigInt(desChannelId),
      }),
      message: msg,
      replyToMsgId: replyToMsgId,
    })
  );
}

async function handleSrcMsg(event) {
  const message = event.message;

  // if the message from source channel
  const channelId = '-' + message?.peerId?.channelId?.value?.toString();
  if (channelId === srcChannelId) {
    // check if this is new message (no replyTo)
    if (!message.replyTo) {
      // send message to des channel before saving to db
      const sendMsgResult = await sendMsgToDes(message.message, null);

      const signal = new SignalModel({
        srcChannelId: channelId,
        srcMsgId: message.id,
        desChannelId: desChannelId,
        desMsgId: sendMsgResult.updates[0].id,
        msg: message.message,
      });
      // save to db
      await signal.save();
    } else {
      // find the root message
      const rootSignal = await signalModel.findOne({
        srcChannelId,
        srcMsgId: message.replyTo.replyToMsgId,
      });
      // send message
      const sendMsgResult = await sendMsgToDes(
        message.message,
        rootSignal.desMsgId
      );
      // save to db
      const newSignal = new SignalModel({
        srcChannelId: channelId,
        srcMsgId: message.id,
        desChannelId: desChannelId,
        desMsgId: sendMsgResult.updates[0].id,
        msg: message.message,
      });
      await newSignal.save();
    }
  }
}

module.exports = bootstrapTelegram;
