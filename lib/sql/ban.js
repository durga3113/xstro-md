import config from '../../config.js';
import { DataTypes } from 'sequelize';

const BanDB = config.DATABASE.define(
	'ban',
	{
		jid: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		timestamps: false,
		tableName: 'ban',
	},
);

export const addBan = async jid => {
	const fullJid = jid.includes('@s.whatsapp.net') ? jid : `${jid}@s.whatsapp.net`;
	const trimmedJid = fullJid.replace('@s.whatsapp.net', '');
	await BanDB.create({ jid: trimmedJid });
	return `_@${trimmedJid} has been banned._`;
};

export const removeBan = async jid => {
	const fullJid = jid.includes('@s.whatsapp.net') ? jid : `${jid}@s.whatsapp.net`;
	const trimmedJid = fullJid.replace('@s.whatsapp.net', '');
	const ban = await BanDB.findOne({ where: { jid: trimmedJid } });
	if (ban) {
		await ban.destroy();
		return `_@${trimmedJid} unbanned._`;
	}
	return `_@${trimmedJid} wasn't banned._`;
};

export const getBanned = async () => {
	const bannedUsers = await BanDB.findAll();
	return bannedUsers.map(user => user.jid);
};

export const isBanned = async jid => {
	const fullJid = jid.includes('@s.whatsapp.net') ? jid : `${jid}@s.whatsapp.net`;
	const trimmedJid = fullJid.replace('@s.whatsapp.net', '');
	const ban = await BanDB.findOne({ where: { jid: trimmedJid } });
	return !!ban;
};

export default BanDB;
