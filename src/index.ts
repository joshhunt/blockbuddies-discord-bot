import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { handleCommand, registerCommands } from "./commands";
import logger from "./logger";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const allowedGuildId = process.env.DISCORD_GUILD_ID;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token) throw new Error("DISCORD_TOKEN not configured");
if (!allowedGuildId) throw new Error("DISCORD_GUILD_ID not configured");
if (!clientId) throw new Error("DISCORD_CLIENT_ID not configured");

const allowedGuilds = [allowedGuildId];

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
  const guilds = client.guilds.cache.map((guild) => guild);

  for (const guild of guilds) {
    logger.info("Connected to guild", { name: guild.name, id: guild.id });

    if (!allowedGuilds.includes(guild.id)) {
      logger.info("Leaving guild", {
        name: guild.name,
        id: guild.id,
      });

      await guild.leave();
      continue;
    }

    registerCommands(token, clientId, guild.id);
  }
});

client.on("interactionCreate", handleCommand);

logger.info("Logging in");
client.login(token);
