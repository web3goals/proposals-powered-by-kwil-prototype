# 💡 Proposals powered by Kwil

Boost your community with proposals without smart contracts and transaction fees

## 🔗 Application

https://proposals-powered-by-kwil.vercel.app/

## ✨ About

It is a tool that allows any community to post and vote on decentralized proposals without developing smart contracts and transaction fees.

## ⚒️ How it's made

This project has two parts:

The first is a web3 application that uses Kwill database to store and interact with proposals.

The second is a Kwil custom extension, which implements the necessary features to process proposals. For example, checking membership and the available number of votes for each member, which depends on the amount of tokens they own.

This extension is an independent unit. So everyone can use it in their own project.

## 🔮 What's next

It would be great to:

- Add Discord integration to make it easier to post and vote on proposals.
- And improve the extension by implementing quadratic voting and other proposal-specific features.

## 🏗️ Architecture

![Architecture](/architecture.png)
