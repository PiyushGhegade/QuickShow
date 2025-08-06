import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "movie-booking-app" });

// inngest Function to save user data to mongoDB
const syncuserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({event}) => {
    const {id,first_name,last_name,email_addresses,image_url} = event.data;
    const userdata = {
        _id: id,
        email: email_addresses[0].email_address,
        mane: first_name + ' ' + last_name,
        image: image_url
    }

    await User.create(userdata)
  },
);

// inngest Function to delete user data to mongoDB
const syncuserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({event}) => {
    const {id} = event.data;
    await User.findByIdAndDelete(id)
  },
);


const syncuserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({event}) => {
    const {id,first_name,last_name,email_addresses,image_url} = event.data;
    const userdata = {
        _id: id,
        email: email_addresses[0].email_address,
        mane: first_name + ' ' + last_name,
        image: image_url
    }
    await User.findByIdAndUpdate(id,userdata)
  },
);


export const functions = [syncuserCreation,syncuserDeletion,syncuserUpdation];
