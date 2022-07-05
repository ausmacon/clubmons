import {getName} from './conditions';
import {changeSet, changeMoves} from "./abilities";
import {ssbSets} from "./random-teams";

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// joeythegoon
	shockingstrikes: {
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Always hits 3 times, and each hit has a 5% chance to paralyze. BP is boosted by 1.5x if burnt.",
		shortDesc: "Hits 3 times, 1.5x BP when burnt, 5% para per hit.",
		name: "Shocking Strikes",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, punch: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Quick Attack', target);
			this.add('-anim', target, 'Wild Charge', target);
		},
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(1.5);
			}
		},
		multihit: 3,
		secondary: {
			chance: 5,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		zMove: {basePower: 140},
		maxMove: {basePower: 130},
	},
	explodingphone: {
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon, target) {
			return this.clampIntRange(target.getUndynamaxedHP() / 10, 1);
		},
		category: "Special",
		desc: "Deals 10% of the target's current HP, and burns them.",
		shortDesc: "Deals 1/10 of current HP; burns.",
		name: "Exploding Phone",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Roar of Time", source);
		},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	//The Cakeling
	oldmanstrength: {
		num: 117,
		desc: "Simulates max Attack for 1 turn, then the user must recharge.",
		shortDesc: "Simulates max Attack for 1 turn, then the user must recharge.",
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Old Man Strength",
		pp: 10,
		priority: 1,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Bulk Up", source);
		},
		volatileStatus: 'oldmanstrength',
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['oldmanstrength']) return true;
		},
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Old Man Strength');
				this.add('-message', `${pokemon.name} is exerting his old man strength!`);
			},
			onModifyAtk(atk, pokemon) {
				if (pokemon.volatiles['dynamax']) return;
				return this.chainModify(4);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Old Man Strength', '[silent]');
				this.add('-message', `${pokemon.name} is worn out!`);
				pokemon.addVolatile('mustrecharge');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	// Krystil
	chuckinnuggets: {
		desc: "Can hit 4 to 20 times for a 4, 6, 10, and 20 piece respectively. Each hit has a 5% burn chance.",
		shortDesc: "4-20 hits. 5% burn chance per hit.",
		num: 742,
		accuracy: 100,
		basePower: 9,
		category: "Special",
		name: "Chuckin' Nuggets",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: [4, 20],
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Pyro Ball", target);
		},
		secondary: {
			chance: 5,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		zMove: {basePower: 180},
		maxMove: {basePower: 140},
		contestType: "Clever",
	},
	flavorcannon: {
		num: 705,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Flavor Cannon", //fun little rename, pretty harmless
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Fleur Cannon", target);
		},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	}, 
	// Ieuan
	nanomachinesson: {
		desc: "1/3 recovery and +1 defense.",
		shortDesc: "1/3 recovery and +1 defense.",
		num: 816,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Nanomachines, Son!",
		pp: 10,
		priority: 0,
		flags: {heal: 1, snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Judgment", source);
		},
		heal: [1, 3],
		boosts: {
			def: 1,
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},
	// Shine
	spiritsrevenge: {
		desc: "Ignores stat modifiers.",
		shortDesc: "Ignores stat modifiers",
		num: 816,
		num: 663,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Spirit's Revenge",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Spectral Thief", target);
		},
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	grandjudgment: {
		num: 697,
		accuracy: true,
		basePower: 180,
		category: "Physical",
		isNonstandard: "Past",
		name: "Grand Judgment",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "punishiumz",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Geomancy", source);
			this.add('-anim', source, "Core Enforcer", target);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	judgejuryexecutioner: {
		num: 433,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Judge, Jury, & Executioner",
		pp: 5,
		priority: -7,
		flags: {mirror: 1},
		pseudoWeather: 'judgejuryexecutioner',
		condition: {
			duration: 0,
			onFieldStart(field, source, effect) {
				this.add('-fieldstart', 'move: Judge, Jury, and Executioner');
			},
			onBoost(boost, target, source, effect) {
				if (effect && effect.id === 'zpower') return;
				let i: BoostID;
				for (i in boost) {
					boost[i]! *= -1;
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('judgejuryexecutioner');
			},
			onFieldEnd() {
				this.add('-field', 'none');
				this.add('-fieldend', 'move: Judge, Jury, and Executioner');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: {boost: {accuracy: 1}},
		contestType: "Clever",
	},
	// Meer
	scawyroar: {
		desc: "Phases out opponent, then switches.",
		shortDesc: "Phases out opponent, then switches.",
		num: 46,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Scawy Roar",
		pp: 5,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Roar", target);
		},
		forceSwitch: true,
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: {boost: {def: 1}},
		contestType: "Cute",
	},
	// Eko
	vitalitydrain: {
		num: 668,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Vitality Drain",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Strength Sap", target);
		},
		onHit(target, source) {
			if (target.boosts.atk === -6 || target.boosts.spa === -6) return false;
			const atk = target.getStat('atk', false, true);
			const spa = target.getStat('spa', false, true);
			const success = this.boost({atk: -1, spa: -1}, target, source, null, false, true);
			return !!((this.heal(atk, source, target) && this.heal(spa, source, target)) / 4 || success);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMove: {boost: {def: 1}},
		contestType: "Cute",
	},
	// GONDA CIVIC
	frigatearmada: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Frigate Armada",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Hyper Beam", target);
		},
		self: {
			chance: 50,
			boosts: {
				spd: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
	},
	// i90
	acupuncture: {
		num: 367,
		accuracy: true,
		basePower: 0,
		damageCallback(pokemon, target) {
			return this.clampIntRange(target.getUndynamaxedHP() / 8, 1);
		},
		category: "Status",
		name: "Acupuncture",
		pp: 30,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Icicle Crash", source);
		},
		onHit(target) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (stat === 'accuracy' || stat === 'evasion') continue;
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 1;
				this.boost(boost);
			} else {
				return false;
			}
		},
		secondary: null,
		target: "adjacentAllyOrSelf",
		type: "Normal",
		zMove: {effect: 'crit2'},
		contestType: "Tough",
	},
	// Tiwty
	destructionsword: {
		num: 680,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Destruction Sword",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Extreme Evoboost", source);
			this.add('-anim', source, "Sacred Sword", target);
		},
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	// Violet
	changesong: {
		num: 680,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Change Song",
		pp: 15,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Quiver Dance", source);
		},
		onHit(target, source) {
			if (source.species.name === "Grotle") {
				changeSet(this, source, ssbSets['Violet']);
				return;
			} else if (source.species.name === "Vileplume") {
				changeSet(this, source, ssbSets['Violet-Battle']);
				return;
			}
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	lofitrack: {
		num: 604,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Lofi Track",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'lofitrack',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Ice' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('lofi track boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onModifySpe(spe, pokemon) {
				if (!pokemon.hasType('Ice') && pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					return this.chainModify(0.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Lofi Track', '[from] ability: ' + effect.name, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Lofi Track');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Lofi Track');
			},
		},
		secondary: null,
		target: "all",
		type: "Ice",
		zMove: {boost: {spe: 1}},
		contestType: "Clever",
	},
	battletrack: {
		num: 604,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Battle Track",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'battletrack',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Ground' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('battle track boost');
					return this.chainModify([5325, 4096]);
				}
			},
			// coding hazard effect into rocks/spikes directly
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Battle Track', '[from] ability: ' + effect.name, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Battle Track');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Battle Track');
			},
		},
		secondary: null,
		target: "all",
		type: "Ground",
		zMove: {boost: {spe: 1}},
		contestType: "Clever",
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'stealthrock',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
			onPrepareHit(target, source, move) {
				if (!this.queue.willMove(target) && this.field.isTerrain('battletrack') && source.isGrounded()) {
					this.add('-message', `to ${pokemon.name} falls into a seismic wave, sending the jagged stones into it!`);
					const typeMod = this.clampIntRange(source.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
					this.damage(source.maxhp * Math.pow(2, typeMod) / 8);
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Rock",
		zMove: {boost: {def: 1}},
		contestType: "Cool",
	},
	spikes: {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1, nonsky: 1},
		sideCondition: 'spikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onEntryHazard(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
			onAfterMove(pokemon) {
				let boosted = true;
				for (const target of this.getAllActive()) {
					if (target === pokemon) continue;
					if (this.queue.willMove(target)) {
						boosted = false;
						break;
					}
				}
				if (boosted && this.field.isTerrain('battletrack') && pokemon.isGrounded()) {
					this.add('-message', `to ${pokemon.name} falls into a seismic wave, sending spikes into it!`);
					const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
					this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Ground",
		zMove: {boost: {def: 1}},
		contestType: "Clever",
	},
	terrainpulse: {
		num: 805,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Terrain Pulse",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, pulse: 1},
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			case 'lofitrack':
				move.type = 'Ice';
				break;
			case 'battletrack':
				move.type = 'Ground';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			if (this.field.terrain && pokemon.isGrounded()) {
				move.basePower *= 2;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: {basePower: 160},
		maxMove: {basePower: 130},
	},
	// Zyg
	luckofthedraw: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack, Defense, and Speed by 1 stage.",
		shortDesc: "Raises the user's Attack, Defense, Speed by 1.",
		name: "Luck of the Draw",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Quiver Dance', source);
		},
		boosts: {
			atk: 1,
			def: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// These moves need modified to support Alpha's move
	auroraveil: {
		inherit: true,
		desc: "For 5 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect or Light Screen. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay. Fails unless the weather is Heavy Hailstorm or Hail.",
		shortDesc: "For 5 turns, damage to allies is halved. Hail-like weather only.",
		onTryHitSide() {
			if (!this.field.isWeather(['winterhail', 'heavyhailstorm', 'hail'])) return false;
		},
	},
	blizzard: {
		inherit: true,
		desc: "Has a 10% chance to freeze the target. If the weather is Heavy Hailstorm or Hail, this move does not check accuracy.",
		shortDesc: "10% freeze foe(s). Can't miss in Hail-like weather.",
		onModifyMove(move) {
			if (this.field.isWeather(['winterhail', 'heavyhailstorm', 'hail'])) move.accuracy = true;
		},
	},
	dig: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (['sandstorm', 'winterhail', 'heavyhailstorm', 'hail'].includes(type)) return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	dive: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (['sandstorm', 'winterhail', 'heavyhailstorm', 'hail'].includes(type)) return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
	},
	moonlight: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'heavyhailstorm':
			case 'winterhail':
			case 'hail':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	morningsun: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'heavyhailstorm':
			case 'winterhail':
			case 'hail':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	solarbeam: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		onBasePower(basePower, pokemon, target) {
			const weathers = ['raindance', 'primordialsea', 'sandstorm', 'winterhail', 'heavyhailstorm', 'hail'];
			if (weathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		desc: "This attack charges on the first turn and executes on the second. Power is halved if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.",
		onBasePower(basePower, pokemon, target) {
			const weathers = ['raindance', 'primordialsea', 'sandstorm', 'winterhail', 'heavyhailstorm', 'hail'];
			if (weathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		desc: "The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Heavy Hailstorm, Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.",
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'heavyhailstorm':
			case 'winterhail':
			case 'hail':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	weatherball: {
		inherit: true,
		desc: "Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Heavy Hailstorm or Hail, Water type during Primordial Sea or Rain Dance, Rock type during Sandstorm, and Fire type during Desolate Land or Sunny Day. If the user is holding Utility Umbrella and uses Weather Ball during Primordial Sea, Rain Dance, Desolate Land, or Sunny Day, the move is still Normal-type and does not have a base power boost.",
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'heavyhailstorm':
			case 'winterhail':
			case 'hail':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'heavyhailstorm':
			case 'winterhail':
			case 'hail':
				move.basePower *= 2;
				break;
			}
		},
	},
	// Modified move descriptions for support of Segmr's move
	doomdesire: {
		inherit: true,
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Disconnect, or Future Sight is already in effect for the target's position.",
	},
	futuresight: {
		inherit: true,
		desc: "Deals damage two turns after this move is used. At the end of that turn, the damage is calculated at that time and dealt to the Pokemon at the position the target had when the move was used. If the user is no longer active at the time, damage is calculated based on the user's natural Special Attack stat, types, and level, with no boosts from its held item or Ability. Fails if this move, Doom Desire, or Disconnect is already in effect for the target's position.",
	},
	// Terrain Pulse for consistency
	// genderless infatuation for nui's Condition Override
	attract: {
		inherit: true,
		volatileStatus: 'attract',
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!source.hasAbility('conditionoverride')) {
					if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
						this.debug('incompatible gender');
						return false;
					}
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.id === 'cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onModifySpDPriority: 1,
			onModifySpD(spd, pokemon) {
				for (const target of this.getAllActive()) {
					if (target === pokemon) continue;
					if (target.hasAbility('conditionoverride')) return this.chainModify(0.75);
				}
				return;
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
				if (this.randomChance(1, 2)) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
	},

	// Try playing Staff Bros without dynamax and see what happens
	supermetronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Uses 2-5 random moves. Does not include 1-Base Power Z-Moves, Super Metronome, Metronome, or 10-Base Power Max moves.",
		shortDesc: "Uses 2-5 random moves.",
		name: "Super Metronome",
		isNonstandard: "Custom",
		pp: 100,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onTryMove(pokemon) {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Metronome", source);
		},
		onHit(target, source, effect) {
			const moves = [];
			for (const id in this.dex.data.Moves) {
				const move = this.dex.moves.get(id);
				if (move.realMove || move.id.includes('metronome')) continue;
				// Calling 1 BP move is somewhat lame and disappointing. However,
				// signature Z moves are fine, as they actually have a base power.
				if (move.isZ && move.basePower === 1) continue;
				if (move.gen > this.gen) continue;
				if (move.isMax === true && move.basePower === 10) continue;
				moves.push(move.name);
			}
			let randomMove: string;
			if (moves.length) {
				randomMove = this.sample(moves);
			} else {
				return false;
			}
			this.actions.useMove(randomMove, target);
		},
		multihit: [2, 5],
		secondary: null,
		target: "self",
		type: "???",
	},
};
