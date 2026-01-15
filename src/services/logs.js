"use server";

import { headers } from "next/headers";

const log = async (type, data) => {
  const ip = (await headers()).get("x-forwarded-for");
  data = {
    type,
    ip,
    ...data,
    datetime: (new Date()).toISOString(),
  }
  console.log(data);
}

export const logExport = async (data) => {
  log("export", data);
};

export const logRouting = async (data) => {
  log("routing", data);
};

export const logAction = async (data) => {
  log(`action${data.action_type ? `.${data.action_type}` : ''}`, data);
};

export const logAuth = async (action, data) => {
  log(action, data);
};

export const logAPI = async (data) => {
  log("API", data);
};
