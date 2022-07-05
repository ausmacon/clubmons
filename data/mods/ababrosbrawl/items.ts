export const Items: {[k: string]: ModdedItemData} = {
	// joey
	overheatingphone: {
		name: "Overheating Phone",
		spritenum: 145,
		fling: {
			basePower: 30,
			status: 'brn',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.status !== 'brn') {
				pokemon.trySetStatus('brn', pokemon);
				if (pokemon.status === 'brn') {
					this.add('-message', `${pokemon.name}'s phone is overheating!`);
					this.actions.useMove('Exploding Phone', pokemon);
					pokemon.useItem();
				}
			}
		},
		num: 273,
		gen: 4,
	},
	// Cakeling (altering Rocky Helmet)
	rockyhelmet: {
		name: "Rocky Helmet",
		spritenum: 417,
		fling: {
			basePower: 60,
		},
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && source.ability !== 'safetyfirst') {
				this.damage(source.baseMaxhp / 6, source, target);
			}
		},
		num: 540,
		gen: 5,
	},
	// Violet
	herbaltea: {
		name: "Herbal Tea",
		spritenum: 242,
		fling: {
			basePower: 30,
			status: 'brn',
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 234,
		gen: 2,
	},
	// Krytil
	chronoscope: {
		name: "Chronoscope",
		spritenum: 289,
		fling: {
			basePower: 30,
		},
		onStart(pokemon) {
			pokemon.addVolatile('chronoscope');
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasItem('chronoscope')) {
					pokemon.removeVolatile('chronoscope');
					return;
				}
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					if (this.effectState.lastMove !== move.id) {
						this.effectState.numConsecutive = 1;
					} else {
						this.effectState.numConsecutive++;
					}
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [4096, 4915, 5734, 6553, 7372, 8192];
				const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
				this.debug(`Current Chronoscope boost: ${dmgMod[numConsecutive]}/4096`);
				return this.chainModify([dmgMod[numConsecutive], 4096]);
			},
		},
	},
	// Shine
	punishiumz: {
		name: "Punishium Z",
		onTakeItem: false,
		zMove: "Grand Judgment",
		zMoveFrom: "Spirit's Revenge",
		itemUser: ["Spiritomb"],
		gen: 8,
		desc: "If held by a Spiritomb with Spirit's Revenge, it can use Grand Judgment.",
	},
	// Eko (changing starf berry mechanics
	starfberry: {
		name: "Starf Berry",
		spritenum: 472,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Psychic",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('naturesbounty'))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in pokemon.boosts) {
				if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			}
		},
		num: 207,
		gen: 3,
	},
	// TomTom
	girafarigite: {
		name: "Girafarigite",
		spritenum: 594,
		megaStone: "Zebstrika",
		megaEvolves: "Girafarig",
		itemUser: ["Zebstrika"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 673,
		gen: 6,
		isNonstandard: "Past",
	},
	//GONDA CIVIC
	techboostedmassproduction: {
		name: "Tech Boosted: Mass Production",
		spritenum: 589,
		megaStone: "Gyarados-Mega",
		megaEvolves: "Gyarados",
		itemUser: ["Gyarados"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 676,
		gen: 6,
		isNonstandard: "Past",
	},
	// iGrindy
	swoledew: {
		name: "Swole Dew",
		spritenum: 589,
		megaStone: "Buzzwole",
		megaEvolves: "Cutiefly",
		itemUser: ["Cutiefly"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 676,
		gen: 6,
		isNonstandard: "Past",
	},
	// Tiwty
	destructionruin: {
		name: "Destruction Ruin",
		spritenum: 591,
		megaStone: "Houndoom-Mega",
		megaEvolves: "Houndoom",
		itemUser: ["Houndoom"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 666,
		gen: 6,
		isNonstandard: "Past",
	},
	// Alpha
	caioniumz: {
		name: "Caionium Z",
		onTakeItem: false,
		zMove: "Blistering Ice Age",
		zMoveFrom: "Blizzard",
		itemUser: ["Aurorus"],
		gen: 8,
		desc: "If held by an Aurorus with Blizzard, it can use Blistering Ice Age.",
	},

	// A Quag To The Past
	quagniumz: {
		name: "Quagnium Z",
		onTakeItem: false,
		zMove: "Bounty Place",
		zMoveFrom: "Scorching Sands",
		itemUser: ["Quagsire"],
		gen: 8,
		desc: "If held by a Quagsire with Scorching Sands, it can use Bounty Place.",
	},

	// Kalalokki
	kalalokkiumz: {
		name: "Kalalokkium Z",
		onTakeItem: false,
		zMove: "Gaelstrom",
		zMoveFrom: "Blackbird",
		itemUser: ["Wingull"],
		gen: 8,
		desc: "If held by a Wingull with Blackbird, it can use Gaelstrom.",
	},

	// Robb576
	modium6z: {
		name: "Modium-6 Z",
		onTakeItem: false,
		zMove: "Integer Overflow",
		zMoveFrom: "Photon Geyser",
		itemUser: ["Necrozma-Ultra"],
		gen: 8,
		desc: "If held by a Robb576 with Photon Geyser, it can use Integer Overflow.",
	},
};
