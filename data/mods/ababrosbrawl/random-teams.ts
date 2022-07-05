import RandomTeams from '../../random-teams';

export interface SSBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName;
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
}
interface SSBSets {[k: string]: SSBSet}

export const ssbSets: SSBSets = {
	/*
	// Example:
	Username: {
		species: 'Species', ability: 'Ability', item: 'Item', gender: '',
		moves: ['Move Name', ['Move Name', 'Move Name']],
		signatureMove: 'Move Name',
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', level: 100, shiny: false,
	},
	// Species, ability, and item need to be captialized properly ex: Ludicolo, Swift Swim, Life Orb
	// Gender can be M, F, N, or left as an empty string
	// each slot in moves needs to be a string (the move name, captialized properly ex: Hydro Pump), or an array of strings (also move names)
	// signatureMove also needs to be capitalized properly ex: Scripting
	// You can skip Evs (defaults to 82 all) and/or Ivs (defaults to 31 all), or just skip part of the Evs (skipped evs are 0) and/or Ivs (skipped Ivs are 31)
	// You can also skip shiny, defaults to false. Level can be skipped (defaults to 100).
	// Nature needs to be a valid nature with the first letter capitalized ex: Modest
	*/
	// Please keep sets organized alphabetically based on staff member name!
	'joey the goon': {
		species: 'Obstagoon', ability: "Guts", item: 'Overheating Phone', gender: 'M',
		moves: ['Close Combat', 'Knock Off', 'Volt Switch'],
		signatureMove: 'Shocking Strikes',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	'The Cakeling': {
		species: 'Conkeldurr', ability: 'Safety First', item: 'Heavy-Duty Boots', gender: 'M',
		moves: ['Close Combat', 'Earthquake', 'Knock Off'],
		signatureMove: 'Old Man Strength',
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
	},
	Krytil: {
		nickname: 'Krytil', species: 'Torchic', ability: 'On the Clock', item: 'Chronoscope', gender: 'M',
		moves: ['Work Up', 'Slack Off', 'Flavor Cannon'],
		signatureMove: 'Chuckin Nuggets',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
	'Ieuan-Cat': {
		nickname: 'Ieuan-Cat', species: 'Lucario', ability: 'Immovable Force', item: 'Lucarionite', gender: 'M',
		moves: ['Drain Punch', 'Double Iron Bash', 'Knock Off'],
		signatureMove: 'Nanomachines, Son!',
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant', shiny: true,
	},
	'Scale of Justice': {
		nick: 'Scale of Justice', species: 'Spiritomb', ability: 'Judge, Jury, & Executioner', item: 'Punishium Z', gender: 'N',
		moves: ['Darkest Lariat', 'Close Combat', 'Recover'],
		signatureMove: "Spirit's Revenge",
		evs: {hp: 252, def: 128, spd: 128}, nature: 'Sassy', shiny: true,
	},
	'da babdodook': {
		nickname: 'da babdodook', species: 'Stufful', ability: 'huh wah', item: 'Eviolite', gender: 'M',
		moves: ['Slack Off', 'Scald', 'Rapid Spin'],
		signatureMove: "Scawy Roar",
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Bold', 
	},
	poof: {
		species: 'Jumpluff', ability: "Nature's Bounty", item: 'Starf Berry', gender: 'F',
		moves: ['Swords Dance', 'Acrobatics', 'Spirit Break'],
		signatureMove: "Vitality Drain",
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	iGrindy: {
		species: 'Cutiefly', ability: "Drought", item: 'Swole Dew', gender: 'M',
		moves: ['Horn Leech', 'Blaze Kick', 'Jungle Healing'],
		signatureMove: "Acupuncture",
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	Regis: {
		species: 'Houndoom', ability: "Prankster", item: 'Destruction Ruin', gender: 'N',
		moves: ['Poltergeist', 'Spectral Thief', 'Parting Shot'],
		signatureMove: "Destruction Sword",
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	Violet: {
		species: 'Vileplume', ability: "Lofi Mix", item: 'Herbal Tea', gender: 'F',
		moves: ['Giga Drain', 'Terrain Pulse', 'U-turn'],
		signatureMove: "Change Song",
		evs: {hp: 128, spa: 252, spe: 128}, nature: 'Modest',
	},
	'Violet-Battle': {
		species: 'Grotle', ability: "Battle Mix", item: 'Herbal Tea', gender: 'F',
		moves: ['Giga Drain', 'Terrain Pulse', 'Stealth Rock'],
		signatureMove: "Change Song",
		evs: {hp: 128, spa: 252, spe: 128}, nature: 'Modest',
		skip: 'Violet',
	},
};

const afdSSBSets: SSBSets = {
	'Fox': {
		species: 'Delphox', ability: 'No Ability', item: '', gender: '',
		moves: [],
		signatureMove: 'Super Metronome',
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const wiiulegacy = !ruleTable.has('dynamaxclause');
		const monotype = ruleTable.has('sametypeclause') ? this.sample([...this.dex.types.names()]) : false;

		let pool = debug.length ? debug : wiiulegacy ? Object.keys(afdSSBSets) : Object.keys(ssbSets);
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(ssbSets[x].species).types.includes(monotype));
		}
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			const name = wiiulegacy ? this.sample(pool) : this.sampleNoReplace(pool);
			const ssbSet: SSBSet = wiiulegacy ? this.dex.deepClone(afdSSBSets[name]) : this.dex.deepClone(ssbSets[name]);
			if (ssbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype || wiiulegacy)) { // Type limits are ignored for debugging, monotype, or memes.
				const species = this.dex.species.get(ssbSet.species);
				if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (ssbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			const set: PokemonSet = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender || this.sample(['M', 'F', 'N']),
				evs: ssbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...ssbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs: {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...ssbSet.ivs},
				level: this.adjustLevel || ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : !!ssbSet.shiny,
			};
			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);

			// Any set specific tweaks occur here.
			if (set.name === 'Marshmallon' && !set.moves.includes('Head Charge')) set.moves[this.random(3)] = 'Head Charge';

			if (wiiulegacy) {
				const egg = this.random(100);
				if (egg === 69) {
					set.name = 'Falco';
					set.species = 'Swellow';
				} else if (egg === 96) {
					set.name = 'Captain Falcon';
					set.species = 'Talonflame';
				}
				if (this.randomChance(1, 100)) {
					set.item = 'Mail';
				}
			}

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === this.maxTeamSize && set.ability === 'Illusion') {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
