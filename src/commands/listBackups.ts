import { CacheType, CommandInteraction } from "discord.js";

export default async function listBackups(
  interaction: CommandInteraction<CacheType>
) {
  if (!interaction.isCommand()) return;

  await interaction.reply(
    `Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`
  );
}
