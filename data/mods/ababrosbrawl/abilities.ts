import {SSBSet, ssbSets} from "./random-teams";
import {getName} from './conditions';

// Used in many abilities, placed here to reduce the number of updates needed and to reduce the chance of errors
const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream', 'heavyhailstorm', 'winterhail', 'turbulence'];

/**
 * Assigns a new set to a Pokémon
 * @param pokemon the Pokemon to assign the set to
 * @param newSet the SSBSet to assign
 */
export function changeSet(context: Battle, pokemon: Pokemon, newSet: SSBSet, changeAbility = false) {
	if (pokemon.transformed) return;
	const evs: StatsTable = {
		hp: newSet.evs?.hp || 0,
		atk: newSet.evs?.atk || 0,
		def: newSet.evs?.def || 0,
		spa: newSet.evs?.spa || 0,
		spd: newSet.evs?.spd || 0,
		spe: newSet.evs?.spe || 0,
	};
	const ivs: StatsTable = {
		hp: newSet.ivs?.hp || 31,
		atk: newSet.ivs?.atk || 31,
		def: newSet.ivs?.def || 31,
		spa: newSet.ivs?.spa || 31,
		spd: newSet.ivs?.spd || 31,
		spe: newSet.ivs?.spe || 31,
	};
	pokemon.set.evs = evs;
	pokemon.set.ivs = ivs;
	if (newSet.nature) pokemon.set.nature = Array.isArray(newSet.nature) ? context.sample(newSet.nature) : newSet.nature;
	const oldShiny = pokemon.set.shiny;
	pokemon.set.shiny = (typeof newSet.shiny === 'number') ? context.randomChance(1, newSet.shiny) : !!newSet.shiny;
	let percent = (pokemon.hp / pokemon.baseMaxhp);
	if (newSet.species === 'Shedinja') percent = 1;
	pokemon.formeChange(newSet.species, context.effect, true);
	const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
		(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
	if (oldShiny !== pokemon.set.shiny) context.add('replace', pokemon, details);
	if (changeAbility) pokemon.setAbility(newSet.ability as string);

	pokemon.baseMaxhp = pokemon.species.name === 'Shedinja' ? 1 : Math.floor(Math.floor(
		2 * pokemon.species.baseStats.hp + pokemon.set.ivs.hp + Math.floor(pokemon.set.evs.hp / 4) + 100
	) * pokemon.level / 100 + 10);
	const newMaxHP = pokemon.baseMaxhp;
	pokemon.hp = Math.round(newMaxHP * percent);
	pokemon.maxhp = newMaxHP;
	context.add('-heal', pokemon, pokemon.getHealth, '[silent]');
	if (pokemon.item) {
		let item = newSet.item;
		if (typeof item !== 'string') item = item[context.random(item.length)];
		if (context.toID(item) !== (pokemon.item || pokemon.lastItem)) pokemon.setItem(item);
	}
	if (!pokemon.m.datacorrupt) {
		const newMoves = changeMoves(context, pokemon, newSet.moves.concat(newSet.signatureMove));
		pokemon.moveSlots = newMoves;
		// @ts-ignore Necessary so pokemon doesn't get 8 moves
		pokemon.baseMoveSlots = newMoves;
	}
	context.add('-ability', pokemon, `${pokemon.getAbility().name}`);
	context.add('message', `${pokemon.name} changed form!`);
}

/**
 * Assigns new moves to a Pokemon
 * @param pokemon The Pokemon whose moveset is to be modified
 * @param newSet The set whose moves should be assigned
 */
export function changeMoves(context: Battle, pokemon: Pokemon, newMoves: (string | string[])[]) {
	const carryOver = pokemon.moveSlots.slice().map(m => m.pp / m.maxpp);
	// In case there are ever less than 4 moves
	while (carryOver.length < 4) {
		carryOver.push(1);
	}
	const result = [];
	let slot = 0;
	for (const newMove of newMoves) {
		const moveName = Array.isArray(newMove) ? newMove[context.random(newMove.length)] : newMove;
		const move = context.dex.moves.get(context.toID(moveName));
		if (!move.id) continue;
		const moveSlot = {
			move: move.name,
			id: move.id,
			// eslint-disable-next-line max-len
			pp: ((move.noPPBoosts || move.isZ) ? Math.floor(move.pp * carryOver[slot]) : Math.floor((move.pp * (8 / 5)) * carryOver[slot])),
			maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
			target: move.target,
			disabled: false,
			disabledSource: '',
			used: false,
		};
		result.push(moveSlot);
		slot++;
	}
	return result;
}

export const Abilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	"abilityid": {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// joey
	hotheaded: {
		desc: "User cannot be afflicted with any status besides burn. Burn boosts Attack by 1.5x",
		shortDesc: "Can only be burned, 1.5x Atk when burnt.",
		onSetStatus(status, target, source, effect) {
			if (['brn'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Hot Headed');
			}
			return false;
		},
		name: "Hot Headed",
		rating: 3,
		num: 62,
	},
	// The Cakeling
	safetyfirst: {
		desc: "User is protected from all contact damage.",
		shortDesc: "Protective Pads as an ability.", //ability will be coded elsewhere 
		name: "Safety First",
		rating: 3,
		num: 62,
	},
	roughskin: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && source.abilityid !== 'safetyfirst') {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		name: "Rough Skin",
		rating: 2.5,
		num: 24,
	},
	ironbarbs: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && source.abilityid !== 'safetyfirst') {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		name: "Iron Barbs",
		rating: 2.5,
		num: 24,
	},
	flamebody: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && source.abilityid !== 'safetyfirst') {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('brn', target);
				}
			}
		},
		name: "Flame Body",
		rating: 2,
		num: 49,
	},
	static: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && source.abilityid !== 'safetyfirst') {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
		name: "Static",
		rating: 2,
		num: 49,
	},
	poisonpoint: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && source.abilityid !== 'safetyfirst') {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('psn', target);
				}
			}
		},
		name: "Poison Point",
		rating: 2,
		num: 49,
	},
	// Krytil
	ontheclock: {
		desc: "Upon knocking out an opponent, Krytil will become the manager.",
		shortDesc: "Upon knocking out an opponent, Krytil will become the manager.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'torchic' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: On the Clock');
				source.formeChange('Moltres-Galar', this.effect, true);
				this.add('-message', `${source.name} has been promoted to manager!`);
			}
		},
		isPermanent: true,
		name: "On the Clock",
		rating: 4,
		num: 210,
	},
	// ieuan
	immovableforce: {
		desc: "Defense-based Download clone.",
		shortDesc: "Defense-based Download clone.",
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.foes()) {
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totalatk && totalatk >= totalspa) {
				this.boost({def: 1});
			} else if (totalspa) {
				this.boost({spd: 1});
			}
		},
		name: "Immovable Force",
		rating: 3.5,
		num: 88,
	},
	immovableforce1: {
		desc: "If the opponent's defenses are larger than their offenses, +1 Attack. Vice versa, +1 Defense and SpDef.",
		shortDesc: "Opp's Defenses > Offenses, +1 Attack. Opp's Offenses > Defenses, +1 Def/SpDef.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					activated = true;
				}
				if (target.getStat('atk', false, true) > target.getStat('def', false, true)) {
					if (target.getStat('atk', false, true) > target.getStat('spd', false, true)) {
						if (target.getStat('atk', false, true) > target.getStat('spe', false, true)) {
							if (target.getStat('atk', false, true) > target.getStat('spa', false, true)) {
								this.boost({def: 1, spd: 1}, pokemon);
							}
						}
					}
				}
				if (target.getStat('spa', false, true) > target.getStat('def', false, true)) {
					if (target.getStat('spa', false, true) > target.getStat('spd', false, true)) {
						if (target.getStat('spa', false, true) > target.getStat('spe', false, true)) {
							if (target.getStat('spa', false, true) > target.getStat('atk', false, true)) {
								this.boost({def: 1, spd: 1}, pokemon);
							}
						}
					}
				}
				if (target.getStat('spe', false, true) > target.getStat('def', false, true)) {
					if (target.getStat('spe', false, true) > target.getStat('spd', false, true)) {
						if (target.getStat('spe', false, true) > target.getStat('spa', false, true)) {
							if (target.getStat('spe', false, true) > target.getStat('atk', false, true)) {
								this.boost({def: 1, spd: 1}, pokemon);
							}
						}
					}
				}
				if (pokemon.getStat('def', false, true) > pokemon.getStat('spa', false, true)) {
					if (pokemon.getStat('def', false, true) > pokemon.getStat('atk', false, true)) {
						if (pokemon.getStat('def', false, true) > pokemon.getStat('spe', false, true)) {
							if (pokemon.getStat('def', false, true) > pokemon.getStat('spd', false, true)) {
								this.boost({atk: 1}, pokemon);
							}
						}
					}
				}
				if (pokemon.getStat('spd', false, true) > pokemon.getStat('spa', false, true)) {
					if (pokemon.getStat('spd', false, true) > pokemon.getStat('atk', false, true)) {
						if (pokemon.getStat('spd', false, true) > pokemon.getStat('spe', false, true)) {
							if (pokemon.getStat('spd', false, true) > pokemon.getStat('def', false, true)) {
									this.boost({atk: 1}, pokemon);
							}
						}
					}
				}
			}		
		},
		name: "Immovable Force 1",
		rating: 3.5,
		num: 88,
	},
	// Shine
	judgejuryexecutioner: {
		desc: "All boosts are treated inversely as long as the user is on the field. Reverted on switch.",
		shortDesc: "All boosts are treated inversely as long as the user is on the field. Reverted on switch.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (target.species.id !== 'spiritomb') {
					if (!activated) {
						this.add('-ability', pokemon, 'Judge, Jury, & Executioner', 'boost');
						activated = true;
						this.field.addPseudoWeather('judgejuryexecutioner');
					}
					let success = false;
					let i: BoostID;
					for (i in target.boosts) {
						if (target.boosts[i] === 0) continue;
						target.boosts[i] = -target.boosts[i];
						success = true;
					}
					if (!success) return false;
					this.add('-invertboost', target);
				}
			}
		},
		onAnySetPseudoWeather(target, source, weather) {
			const pseudoWeathers = ['trickroom', 'wonderroom', 'magicroom'];
			if (this.field.getPseudoWeather().id === 'judgejuryexecutioner' && !pseudoWeather.includes(pseudoweather.id)) return false;
		},
		onEnd(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (target.species.id !== 'spiritomb') {
					if (!activated) {
						this.add('-ability', pokemon, 'Judge, Jury, & Executioner', 'boost');
						activated = true;
						this.field.removePseudoWeather('judgejuryexecutioner');
					}
					let success = false;
					let i: BoostID;
					for (i in target.boosts) {
						if (target.boosts[i] === 0) continue;
						target.boosts[i] = -target.boosts[i];
						success = true;
					}
					if (!success) return false;
					this.add('-invertboost', target);
					this.add('-message', `${pokemon.name}'s jurisdiction shifts away!`);
				}
			}
		},
		name: "Judge, Jury, & Executioner",
		rating: 4.5,
		num: 190,
	},
	// Meer
	huhwah: {
		desc: "Unaware + Fluffy",
		shortDesc: "Unaware + Fluffy",
		name: "huh wah",
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		isBreakable: true,
		rating: 4,
		num: 109,
	},
	// Eko
	naturesbounty: {
		desc: "Gluttony + Harvest",
		shortDesc: "Gluttony + Harvest",
		name: "Nature's Bounty",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), "[from] ability: Nature's Bounty");
				}
			}
		},
		rating: 2.5,
		num: 139,
	},
	// TomTom
	inverseroom: {
		desc: "Trick Room on switch; lasts until the user switches out.",
		shortDesc: "Trick Room on switch; lasts until the user switches out.",
		OnStart(pokemon) { 
			this.field.addPseudoWeather('trickroom');
			this.field.pseudoWeather.trickroom.duration = 0;
			this.add('-message', `$pokemon.name} twisted the dimensions!`);
			this.add('-fieldstart', 'move: Trick Room');
		},
		OnAnyTryMove(target, source, effect) {
			if (['trickroom'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Inverse Room', move, '[of] ' + target);
				return false;
			}
		},
		OnEnd(pokemon) {
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('inverseroom')) {
					return;
				}
			}
			this.field.removePseudoWeather('trickroom');
			this.add('-fieldend', 'move: Trick Room');
		},
		name: "Inverse Room",
		rating: 4.5,
		num: -11,
	},
	// GONDA CIVIC
	roughtimetofizzle: {
		desc: "Intimidate for accuracy.",
		shortDesc: "Intimidate for accuracy.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Rough Time to Fizzle', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({accuracy: -1}, target, pokemon, null, true);
				}
			}
		},
		name: "Rough Time to Fizzle",
		rating: 3.5,
		num: 22,
	},
	venetianarsenal: {
		name: "Venetian Arsenal",
		onHit(target, source, move) {
			if (move.category === 'Status') {
				const newMove = this.dex.getActiveMove(move.id);
				this.actions.useMove(newMove, source);
				return null;
			}
		},
		condition: {
			duration: 1,
		},
		isBreakable: true,
		rating: 4,
		num: 156,
	},
	// Tiwty
	destruction: {
		onStart(pokemon) {
			pokemon.removeVolatile('truant');
			if (pokemon.activeTurns && (pokemon.moveThisTurnResult !== undefined || !this.queue.willMove(pokemon))) {
				pokemon.addVolatile('truant');
			}
		},
		onBeforeMovePriority: 9,
		onBeforeMove(pokemon) {
			if (pokemon.removeVolatile('truant')) {
				this.add('-message', `${pokemon.name}'s hubris prevents it from making a move!`);
				return false;
			}
			pokemon.addVolatile('truant');
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(2);
		},
		condition: {},
		name: "Destruction",
		rating: -1,
		num: 54,
	},
	// iGrindy
	cleanslate: {
		desc: "Cloud Nine + Grassy Surge; Haze on switch-in.",
		shortDesc: "Cloud Nine + Grassy Surge; Haze on switch-in.",
		onStart(pokemon) {
			if (this.field.terrain) {
				this.field.clearTerrain();
			}
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
			this.field.setTerrain('grassyterrain');
			this.add('-message', `${pokemon.name} starts the field anew!`);
		},
		suppressWeather: true,
		name: "Clean Slate",
		rating: 2,
		num: 13,
	},
	// Violet
	lofimix: {
		onStart(source) {
			this.field.clearTerrain();
			this.field.setTerrain('lofitrack');
		},
		name: "Lofi Mix",
		rating: 4,
		num: 226,
	},
	battlemix: {
		onStart(source) {
			this.field.clearTerrain();
			this.field.setTerrain('battletrack');
		},
		name: "Battle Mix",
		rating: 4,
		num: 226,
	},
	// Modified Illusion to support SSB volatiles
	illusion: {
		inherit: true,
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				let disguisedAs = this.toID(pokemon.illusion.name);
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				// Handle users whose names match a species
				if (this.dex.species.get(disguisedAs).exists) disguisedAs += 'user';
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[this.toID(pokemon.name)]) {
					const status = this.dex.conditions.get(this.toID(pokemon.name));
					if (status?.exists) {
						pokemon.addVolatile(this.toID(pokemon.name), pokemon);
					}
				}
			}
		},
	},

	// Modified various abilities to support Alpha's move & pilo's abiility
	deltastream: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'deltastream' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	desolateland: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'desolateland' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	primordialsea: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'primordialsea' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	forecast: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'winterhail':
			case 'heavyhailstorm':
			case 'hail':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');
			}
		},
	},
	icebody: {
		inherit: true,
		desc: "If Hail or Heavy Hailstorm is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail or Heavy Hailstorm.",
		shortDesc: "Hail-like weather active: heals 1/16 max HP each turn; immunity to Hail-like weather.",
		onWeather(target, source, effect) {
			if (['heavyhailstorm', 'hail', 'winterhail'].includes(effect.id)) {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (['heavyhailstorm', 'hail', 'winterhail'].includes(type)) return false;
		},
	},
	iceface: {
		inherit: true,
		desc: "If this Pokemon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Hail or Heavy Hailstorm begins or when Eiscue switches in while Hail or Heavy Hailstorm is active. Confusion damage also breaks the ice face.",
		shortDesc: "If Eiscue, first physical hit taken deals 0 damage. Effect is restored in Hail-like weather.",
		onStart(pokemon) {
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'winterhail']) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onAnyWeatherStart() {
			const pokemon = this.effectState.target;
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'winterhail']) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
	},
	slushrush: {
		inherit: true,
		shortDesc: "If a Hail-like weather is active, this Pokemon's Speed is doubled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'winterhail'])) {
				return this.chainModify(2);
			}
		},
	},
	snowcloak: {
		inherit: true,
		desc: "If Heavy Hailstorm, Winter Hail, or Hail is active, this Pokemon's evasiveness is multiplied by 1.25. This Pokemon takes no damage from Heavy Hailstorm or Hail.",
		shortDesc: "If a Hail-like weather is active, 1.25x evasion; immunity to Hail-like weathers.",
		onImmunity(type, pokemon) {
			if (['heavyhailstorm', 'hail', 'winterhail'].includes(type)) return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['heavyhailstorm', 'hail', 'winterhail'])) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
	},
	// Modified Magic Guard for Alpha
	magicguard: {
		inherit: true,
		shortDesc: "This Pokemon can only be damaged by direct attacks and Heavy Hailstorm.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'heavyhailstorm') return;
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
	},
	// Modified Unaware for Blaz's move
	unaware: {
		inherit: true,
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['spd'] = 0;
				boosts['accuracy'] = 0;
			}
		},
	},
	// Modified Stakeout for Hubriz to have a failsafe
	stakeout: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) {
			if (!defender?.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender) {
			if (!defender?.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
	},
};
