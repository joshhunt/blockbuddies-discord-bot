import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { CacheType, CommandInteraction, Interaction } from "discord.js";
import { Routes } from "discord.js/node_modules/discord-api-types/v10";
import logger from "../logger";
import listBackups from "./listBackups";

function makeCommand(
  name: string,
  description: string,
  handler: (interaction: CommandInteraction<CacheType>) => Promise<void>
) {
  return { name, description, handler };
}

const COMMANDS = [
  makeCommand("list_backups", "List available backups", listBackups),
];

export function registerCommands(
  token: string,
  clientId: string,
  guildId: string
) {
  const commands = COMMANDS.map((cmd) =>
    new SlashCommandBuilder()
      .setName(cmd.name)
      .setDescription(cmd.description)
      .toJSON()
  );

  const rest = new REST({ version: "10" }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() =>
      logger.info("Successfully registered application commands", { guildId })
    )
    .catch(console.error);
}

export function handleCommand(interaction: Interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const command = COMMANDS.find((v) => v.name === commandName);

  if (!command) {
    logger.error("Could not find handler for command", { commandName });
    return;
  }

  command.handler(interaction);
}
