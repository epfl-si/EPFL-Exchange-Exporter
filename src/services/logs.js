"use server";

import { promises as fs, existsSync } from 'fs';

import { headers } from "next/headers";

const log = async (type, data) => {
  const ip = (await headers()).get("x-forwarded-for");
  data = {
    type,
    ip,
    ...data,
    timestamp: (new Date()).toISOString(),
  }
  const dataFormat = JSON.stringify(data);

  console.info(dataFormat);

  // Handle creation of log's folder and file if not exist
  const folderPath = `${process.cwd()}/logs`;
  const filePath = `${folderPath}/data.log`;

  if (!existsSync(filePath)) {
    fs.mkdir(folderPath)
    fs.open(filePath, 'w')
  }
  await fs.appendFile(filePath, dataFormat + "\n");
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
