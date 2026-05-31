// commands/play.js — Opens the main menu
import { SlashCommandBuilder } from 'discord.js';
import Player from '../models/Player.js';
import { renderMainMenu } from '../handlers/menuHandler.js';
import { getMarketState } from '../index.js';

export const playCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Open the PCForge main menu'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      let player = await Player.findOne({ userId: interaction.user.id });
      if (!player) {
        player = new Player({
          userId: interaction.user.id,
          username: interaction.user.username
        });
        await player.save();
      } else {
        player.username = interaction.user.username;
        await player.save();
      }
      const response = renderMainMenu(player);
      await interaction.editReply(response);
    } catch (err) {
      console.error('play command error:', err);
      await interaction.editReply({ content: '❌ Something went wrong. Try again!' });
    }
  }
};
