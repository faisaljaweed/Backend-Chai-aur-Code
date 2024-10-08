import { asynchandler } from "../utils/asynchandler.js";

// toogle Sunscription
// getUserChannel Subscription
// getSubscribed Channels

const toogleSubscription = asynchandler(async (req, res) => {
  const { channelId } = req.params;
});

const getUserChannelSubscription = asynchandler(async (req, res) => {
  const channelId = req.params;
});

const getSubscribedChannels = asynchandler(async (req, res) => {
  const { subscribedId } = req.params;
});

export {
  toogleSubscription,
  getUserChannelSubscription,
  getSubscribedChannels,
};
