import {FS} from '../../../lib';
import {toID} from '../../../sim/dex-data';

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	if (cells.length > 3) throw new Error(`Invalid entry when parsing usergroups.csv`);
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}

export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return group + name;
}

export const Conditions: {[k: string]: ModdedConditionData & {innateName?: string}} = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Username')}|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Username')}|Switch Out Message`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Username')}|Faint Message`);
		},
		// Innate effects go here
	},
	IMPORTANT: Obtain the username from getName
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	
	joeythegoon: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('joey the goon')}|aye how ya doin, lemme getcha a bacon egg and cheese`);
			this.add('-ability', pokemon, 'Hot Headed', 'boost');
			this.add('-message', `${pokemon.name} is getting hot headed!`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('joey the goon')}|brb gotta get my tea`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('joey the goon')}|fuck`);
		},
		onSetStatus(status, target, source, effect) {
			if (['brn'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Hot Headed');
			}
			return false;
		},
	},
	thecakeling: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('The Cakeling')}|Blue-Collar Power!`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('The Cakeling')}|Time for my break!`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('The Cakeling')}|Shouldn't have taken this job...`);
		},
	},
	krytil: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Krystil')}|Hi Welcome to Rytl's, how can I help you today?`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Krystil')}|Brb restroom break`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Krystil')}|oh damn i'm fired`);
		},
	},
	ieuancat: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Ieuan-Cat')}|Oh Fuk Am In`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Ieuan-Cat')}|Brb Food`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Ieuan-Cat')}|Pain.mp4`);
		},
	},
	scaleofjustice: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Scale of Justice')}|May Ma'at guide me.`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Scale of Justice')}|Let us watch how the scales rest, Thoth.`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Scale of Justice')}|Anubis has seen the results.`);
		},
	},
	dababdodook: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Da babdodook')}|kia ora`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Da babdodook')}|chur bruv`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Da babdodook')}|oh ye nah just headin out for a stretch`);
		},
	},
	poof: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('poof')}|Poof! The Champion is here!`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('poof')}|Poof! I'm gone!`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('poof')}|Poof! I'm... dead...`);
		},
	},
	theprofessionalryan: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('The Professional Ryan')}|It's time for things to get Weird.`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('The Professional Ryan')}|That's enough Weirdness... For Now`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('The Professional Ryan')}|Did I get out Weirded?`);
		},
	},
	gondacivic: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('GONDA CIVIC')}|Hey guys, what's your gold per turn?`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('GONDA CIVIC')}|GOAL COMPLETE: FIND MONKEY`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('GONDA CIVIC')}|We should have dodged`);
		},
	},
	igrindy: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('iGrindy')}|Prepare to get smoked!`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('iGrindy')}|Get me out, I don't wanna be here anymore`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('iGrindy')}|man`);
		},
	},
	regis: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Regis')}|Check me out. I'm majestic as fuck!`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Regis')}|No funny business. I'm a proponent of mutual consent.`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Regis')}|I'd clap slowly, applauding you but, y'know, no hands.`);
		},
		rating: 5,
		num: 37,
	},
	violet: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Violet')}|Biology fact! I am in your walls.`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Violet')}|Later nerd`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Violet')}|what the fucvk`);
		},
	},
	////////////////// ABA bros above 
	abdelrahman: {
		noCopy: true,
		onStart() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Abdelrahman')}|good morning, i'm town`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Abdelrahman')}|brb gonna go lynch scum`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Abdelrahman')}|I CC COP TOWN FAILED`);
		},
	},
	billo: {
		noCopy: true,
		onStart(source) {
			let activeMon = source.side.foe.active[0].species.name;
			if (!activeMon) activeMon = "Pokemon";
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Billo')}|Your ${activeMon} looks hacked.`);
		},
		onSwitchOut() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Billo')}|Let me inspect your Pokemon, brb`);
		},
		onFaint() {
			this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Billo')}|Yep, definitely hacked.`);
		},
		innateName: "Unaware",
		shortDesc: "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		// Unaware innate
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser.illusion) return;
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
	},
	// Heavy Hailstorm status support for Alpha
	heavyhailstorm: {
		name: 'HeavyHailstorm',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Steel' && move.category !== 'Status') {
				this.debug('Heavy Hailstorm Steel suppress');
				this.add('-message', 'The hail suppressed the move!');
				this.add('-fail', attacker, move, '[from] Heavy Hailstorm');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Heavy Hailstorm ice boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			this.add('-message', 'The hail became extremely chilling!');
		},
		onModifyMove(move, pokemon, target) {
			if (!this.field.isWeather('heavyhailstorm')) return;
			if (move.category !== "Status") {
				this.debug('Adding Heavy Hailstorm freeze');
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.status === 'frz') return;
				}
				move.secondaries.push({
					chance: 10,
					status: 'frz',
				});
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('heavyhailstorm')) this.eachEvent('Weather');
		},
		onWeather(target, source, effect) {
			if (target.isAlly(this.effectState.source)) return;
			// Hail is stronger from Heavy Hailstorm
			if (!target.hasType('Ice')) this.damage(target.baseMaxhp / 8);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	// Forever Winter Hail support for piloswine gripado
	winterhail: {
		name: 'Winter Hail',
		effectType: 'Weather',
		duration: 0,
		onFieldStart(field, source, effect) {
			this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			this.add('-message', 'It became winter!');
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasType('Ice')) return this.chainModify(0.5);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('winterhail')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Ice')) return;
			this.damage(target.baseMaxhp / 8);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	raindrop: {
		name: 'Raindrop',
		noCopy: true,
		onStart(target) {
			this.effectState.layers = 1;
			this.effectState.def = 0;
			this.effectState.spd = 0;
			this.add('-start', target, 'Raindrop');
			this.add('-message', `${target.name} has ${this.effectState.layers} raindrop(s)!`);
			const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
			this.boost({def: 1, spd: 1}, target, target);
			if (curDef !== target.boosts.def) this.effectState.def--;
			if (curSpD !== target.boosts.spd) this.effectState.spd--;
		},
		onRestart(target) {
			this.effectState.layers++;
			this.add('-start', target, 'Raindrop');
			this.add('-message', `${target.name} has ${this.effectState.layers} raindrop(s)!`);
			const curDef = target.boosts.def;
			const curSpD = target.boosts.spd;
			this.boost({def: 1, spd: 1}, target, target);
			if (curDef !== target.boosts.def) this.effectState.def--;
			if (curSpD !== target.boosts.spd) this.effectState.spd--;
		},
		onEnd(target) {
			if (this.effectState.def || this.effectState.spd) {
				const boosts: SparseBoostsTable = {};
				if (this.effectState.def) boosts.def = this.effectState.def;
				if (this.effectState.spd) boosts.spd = this.effectState.spd;
				this.boost(boosts, target, target);
			}
			this.add('-end', target, 'Raindrop');
			if (this.effectState.def !== this.effectState.layers * -1 || this.effectState.spd !== this.effectState.layers * -1) {
				this.hint("Raindrop keeps track of how many times it successfully altered each stat individually.");
			}
		},
	},
	// Brilliant Condition for Arcticblast
	brilliant: {
		name: 'Brilliant',
		duration: 5,
		onStart(pokemon) {
			this.add('-start', pokemon, 'Brilliant');
		},
		onModifyAtk() {
			return this.chainModify(1.5);
		},
		onModifyDef() {
			return this.chainModify(1.5);
		},
		onModifySpA() {
			return this.chainModify(1.5);
		},
		onModifySpD() {
			return this.chainModify(1.5);
		},
		onModifySpe() {
			return this.chainModify(1.5);
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['perishsong']) pokemon.removeVolatile('perishsong');
		},
		onTryAddVolatile(status) {
			if (status.id === 'perishsong') return null;
		},
		onResidualOrder: 7,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'move: Ingrain');
			return null;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Brilliant');
		},
	},
	// Custom status for HoeenHero's move
	stormsurge: {
		name: "Storm Surge",
		duration: 2,
		durationCallback(target, source, effect) {
			const windSpeeds = [65, 85, 95, 115, 140];
			return windSpeeds.indexOf((effect as ActiveMove).basePower) + 2;
		},
		onSideStart(targetSide) {
			this.add('-sidestart', targetSide, 'Storm Surge');
			this.add('-message', `Storm Surge flooded the afflicted side of the battlefield!`);
		},
		onEnd(targetSide) {
			this.add('-sideend', targetSide, 'Storm Surge');
			this.add('-message', 'The Storm Surge receded.');
		},
		onModifySpe() {
			return this.chainModify(0.75);
		},
	},
	// Kipkluif, needs to end in mod to not trigger aelita/andrew's effect
	degeneratormod: {
		onBeforeSwitchOut(pokemon) {
			let alreadyAdded = false;
			for (const source of this.effectState.sources) {
				if (!source.hp || source.volatiles['gastroacid']) continue;
				if (!alreadyAdded) {
					const foe = pokemon.side.foe.active[0];
					if (foe) this.add('-activate', foe, 'ability: Degenerator');
					alreadyAdded = true;
				}
				this.damage((pokemon.baseMaxhp * 33) / 100, pokemon);
			}
		},
	},
	// For ravioliqueen
	haunting: {
		name: 'Haunting',
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onStart(target) {
			this.add('-start', target, 'Haunting');
		},
		onResidualOrder: 11,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Haunting');
		},
	},
	// for pants' move
	givewistfulthinking: {
		duration: 1,
		onSwitchInPriority: 1,
		onSwitchIn(pokemon) {
			pokemon.addVolatile('wistfulthinking');
		},
	},
	// focus punch effect for litt's move
	nexthuntcheck: {
		duration: 1,
		onStart(pokemon) {
			this.add('-singleturn', pokemon, 'move: /nexthunt');
		},
		onHit(pokemon, source, move) {
			if (move.category !== 'Status') {
				pokemon.volatiles['nexthuntcheck'].lostFocus = true;
			}
		},
	},
	// For Gmars' Effects
	minior: {
		noCopy: true,
		name: 'Minior',
		// Special Forme Effects
		onBeforeMove(pokemon) {
			if (pokemon.set.shiny) return;
			if (pokemon.species.id === "miniorviolet") {
				this.add(`${getName("GMars")} is thinking...`);
				if (this.randomChance(1, 3)) {
					this.add('cant', pokemon, 'ability: Truant');
					return false;
				}
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.set.shiny) return;
			if (pokemon.species.id === 'miniorindigo') {
				this.boost({atk: 1, spa: 1}, pokemon.side.foe.active[0]);
			} else if (pokemon.species.id === 'miniorgreen') {
				this.boost({atk: 1}, pokemon);
			}
		},
		onBoost(boost, target, source, effect) {
			if (target.set.shiny) return;
			if (source && target === source) return;
			if (target.species.id !== 'miniorblue') return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add('message', 'Minior is translucent!');
			}
		},
		onFoeTryMove(target, source, move) {
			if (move.id === 'haze' && target.species.id === 'miniorblue' && !target.set.shiny) {
				move.onHitField = function (this: Battle) {
					this.add('-clearallboost');
					for (const pokemon of this.getAllActive()) {
						if (pokemon.species.id === 'miniorblue') continue;
						pokemon.clearBoosts();
					}
				}.bind(this);
				return;
			}
			const dazzlingHolder = this.effectState.target;
			if (!dazzlingHolder.set.shiny) return;
			if (dazzlingHolder.species.id !== 'minior') return;
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('message', 'Minior dazzles!');
				this.add('cant', target, move, '[of] ' + dazzlingHolder);
				return false;
			}
		},
	},
	// modified paralysis for Inversion Terrain
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.hasAbility('quickfeet')) return;
			if (this.field.isTerrain('inversionterrain') && pokemon.isGrounded()) {
				return this.chainModify(2);
			}
			return this.chainModify(0.5);
		},
		onBeforeMovePriority: 1,
		onBeforeMove(pokemon) {
			if (this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	bigstormcomingmod: {
		name: "Big Storm Coming Mod",
		duration: 1,
		onBasePower() {
			return this.chainModify([1229, 4096]);
		},
	},

	// condition used for brouha's ability
	turbulence: {
		name: 'Turbulence',
		effectType: 'Weather',
		duration: 0,
		onFieldStart(field, source, effect) {
			this.add('-weather', 'DeltaStream', '[from] ability: ' + effect, '[of] ' + source);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'DeltaStream', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather(target) {
			if (!target.hasType('Flying')) this.damage(target.baseMaxhp * 0.06);
			if (this.sides.some(side => Object.keys(side.sideConditions).length)) {
				this.add(`-message`, 'The Turbulence blew away the hazards on both sides!');
			}
			if (this.field.terrain) {
				this.add(`-message`, 'The Turbulence blew away the terrain!');
			}
			const silentRemove = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
			for (const side of this.sides) {
				const keys = Object.keys(side.sideConditions);
				for (const key of keys) {
					if (key.endsWith('mod') || key.endsWith('clause')) continue;
					side.removeSideCondition(key);
					if (!silentRemove.includes(key)) {
						this.add('-sideend', side, this.dex.conditions.get(key).name, '[from] ability: Turbulence');
					}
				}
			}
			this.field.clearTerrain();
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	// Modded rain dance for Kev's ability
	raindance: {
		name: 'RainDance',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source) {
			let newDuration = 5;
			let boostNum = 0;
			if (source?.hasItem('damprock')) {
				newDuration = 8;
			}
			if (source?.hasAbility('kingofatlantis')) {
				for (const teammate of source.side.pokemon) {
					if (teammate.hasType('Water') && teammate !== source) {
						boostNum++;
					}
				}
			}
			return newDuration + boostNum;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'RainDance', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	// Modded hazard moves to fail when Wave terrain is active
	auroraveil: {
		name: "Aurora Veil",
		duration: 5,
		durationCallback(target, source) {
			if (source?.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== source && this.effectState.target.hasAlly(target)) {
				if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
						(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
					return;
				}
				if (!target.getMoveHitData(move).crit && !move.infiltrates) {
					this.debug('Aurora Veil weaken');
					if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
					return this.chainModify(0.5);
				}
			}
		},
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Aurora Veil from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Aurora Veil');
		},
		onSideResidualOrder: 21,
		onSideResidualSubOrder: 1,
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Aurora Veil');
		},
	},
	lightscreen: {
		name: "Light Screen",
		duration: 5,
		durationCallback(target, source) {
			if (source?.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
				if (!target.getMoveHitData(move).crit && !move.infiltrates) {
					this.debug('Light Screen weaken');
					if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
					return this.chainModify(0.5);
				}
			}
		},
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Light Screen from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Light Screen');
		},
		onSideResidualOrder: 21,
		onSideResidualSubOrder: 1,
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Light Screen');
		},
	},
	mist: {
		name: "Mist",
		duration: 5,
		onBoost(boost, target, source, effect) {
			if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
			if (source && target !== source) {
				let showMsg = false;
				let i: BoostID;
				for (i in boost) {
					if (boost[i]! < 0) {
						delete boost[i];
						showMsg = true;
					}
				}
				if (showMsg && !(effect as ActiveMove).secondaries) {
					this.add('-activate', target, 'move: Mist');
				}
			}
		},
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Mist from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Mist');
		},
		onSideResidualOrder: 21,
		onSideResidualSubOrder: 3,
		onSideEnd(side) {
			this.add('-sideend', side, 'Mist');
		},
	},
	reflect: {
		name: "Reflect",
		duration: 5,
		durationCallback(target, source) {
			if (source?.hasItem('lightclay')) {
				return 8;
			}
			return 5;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
				if (!target.getMoveHitData(move).crit && !move.infiltrates) {
					this.debug('Reflect weaken');
					if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
					return this.chainModify(0.5);
				}
			}
		},
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Reflect from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'Reflect');
		},
		onSideResidualOrder: 21,
		onSideEnd(side) {
			this.add('-sideend', side, 'Reflect');
		},
	},
	safeguard: {
		name: "Safeguard",
		duration: 5,
		durationCallback(target, source, effect) {
			if (source?.hasAbility('persistent')) {
				this.add('-activate', source, 'ability: Persistent', effect);
				return 7;
			}
			return 5;
		},
		onSetStatus(status, target, source, effect) {
			if (!effect || !source) return;
			if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
			if (target !== source) {
				this.debug('interrupting setStatus');
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					this.add('-activate', target, 'move: Safeguard');
				}
				return null;
			}
		},
		onTryAddVolatile(status, target, source, effect) {
			if (!effect || !source) return;
			if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
			if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
				if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
				return null;
			}
		},
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Safeguard from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Safeguard');
		},
		onSideResidualOrder: 21,
		onSideResidualSubOrder: 2,
		onSideEnd(side) {
			this.add('-sideend', side, 'Safeguard');
		},
	},
	gmaxsteelsurge: {
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Steel Spikes from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: G-Max Steelsurge');
		},
		onEntryHazard(pokemon) {
			if (pokemon.hasItem('heavydutyboots')) return;
			// Ice Face and Disguise correctly get typed damage from Stealth Rock
			// because Stealth Rock bypasses Substitute.
			// They don't get typed damage from Steelsurge because Steelsurge doesn't,
			// so we're going to test the damage of a Steel-type Stealth Rock instead.
			const steelHazard = this.dex.getActiveMove('Stealth Rock');
			steelHazard.type = 'Steel';
			const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
			this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
		},
	},
	spikes: {
		name: "Spikes",
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Spikes from starting!`);
				return null;
			}
			this.effectState.layers = 1;
			this.add('-sidestart', side, 'move: Spikes');
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
	},
	stealthrock: {
		name: "Stealth Rock",
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Stealth Rock from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Stealth Rock');
		},
		onEntryHazard(pokemon) {
			if (pokemon.hasItem('heavydutyboots')) return;
			const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
			this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
		},
	},
	stickyweb: {
		name: "Sticky Web",
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Sticky Web from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Sticky Web');
		},
		onEntryHazard(pokemon) {
			if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
			this.add('-activate', pokemon, 'move: Sticky Web');
			this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
		},
	},
	toxicspikes: {
		name: "Toxic Spikes",
		onSideStart(side) {
			if (this.field.isTerrain('waveterrain')) {
				this.add('-message', `Wave Terrain prevented Toxic Spikes from starting!`);
				return null;
			}
			this.add('-sidestart', side, 'move: Toxic Spikes');
			this.effectState.layers = 1;
		},
		onSideRestart(side) {
			if (this.effectState.layers >= 2) return false;
			this.add('-sidestart', side, 'move: Toxic Spikes');
			this.effectState.layers++;
		},
		onEntryHazard(pokemon) {
			if (!pokemon.isGrounded()) return;
			if (pokemon.hasType('Poison')) {
				this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
				pokemon.side.removeSideCondition('toxicspikes');
			} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
				return;
			} else if (this.effectState.layers >= 2) {
				pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
			} else {
				pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
			}
		},
	},
	frz: {
		inherit: true,
		onHit(target, source, move) {
			if (move.thawsTarget || move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
				if (move.id === 'randomscreaming') {
					this.add(`c:|${Math.floor(Date.now() / 1000)}|${getName('Gimmick')}|Give me some more paaain, baaaby`);
				}
			}
		},
	},
	// No, you're not dynamaxing.
	dynamax: {
		inherit: true,
		onStart(pokemon) {
			pokemon.removeVolatile('minimize');
			pokemon.removeVolatile('substitute');
			if (pokemon.volatiles['torment']) {
				delete pokemon.volatiles['torment'];
				this.add('-end', pokemon, 'Torment', '[silent]');
			}
			if (['cramorantgulping', 'cramorantgorging'].includes(pokemon.species.id) && !pokemon.transformed) {
				pokemon.formeChange('cramorant');
			}
			this.add('-start', pokemon, 'Dynamax');
			if (pokemon.gigantamax) this.add('-formechange', pokemon, pokemon.species.name + '-Gmax');
			if (pokemon.baseSpecies.name !== 'Shedinja') {
				// Changes based on dynamax level, 2 is max (at LVL 10)
				const ratio = this.format.id.startsWith('gen8doublesou') ? 1.5 : 2;

				pokemon.maxhp = Math.floor(pokemon.maxhp * ratio);
				pokemon.hp = Math.floor(pokemon.hp * ratio);

				this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			}
			this.add('-message', 'Ok. sure. Dynamax. Just abuse it and win the game already.');
			// This is just for fun, as dynamax cannot be in a rated battle.
			this.win(pokemon.side);
		},
	},
	echoedvoiceclone: {
		duration: 2,
		onFieldStart() {
			this.effectState.multiplier = 1;
		},
		onFieldRestart() {
			if (this.effectState.duration !== 2) {
				this.effectState.duration = 2;
				if (this.effectState.multiplier < 5) {
					this.effectState.multiplier++;
				}
			}
		},
	},
	// ALL ABA BROS VOLATILES GO HERE
	oldmanstrength: {
		duration: 2,
		onStart(pokemon) {
			this.add('-start', pokemon, 'move: Old Man Strength');
			this.add('-message', `${pokemon.name} is exerting its old man strength!`);
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
	judgejuryexecutionerholder: {
		onStart(pokemon) {
			let success = false;
			let i: BoostID;
			for (i in pokemon.boosts) {
				if (pokemon.boosts[i] === 0) continue;
				pokemon.boosts[i] = -pokemon.boosts[i];
				success = true;
			}
			if (!success) return false;
			this.add('-invertboost', pokemon);
		},
		onBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i]! *= -1;
			}
		},
		onFieldEnd(pokemon) {
			let success = false;
			let i: BoostID;
			for (i in pokemon.boosts) {
				if (pokemon.boosts[i] === 0) continue;
				pokemon.boosts[i] = -pokemon.boosts[i];
				success = true;
			}
			if (!success) return false;
			this.add('-invertboost', pokemon);
		},
	},
	judgejuryexecutioner: {
		name: 'Judge, Jury, & Executioner',
		effectType: 'pseudoWeather',
		duration: 0,
		onFieldStart(field, source, effect) {
			this.add('-fieldstart', 'move: Judge, Jury, & Executioner');
			this.add('-message', `${source.name} casts its judgment!`);
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
			this.add('-fieldend', 'move: Judge, Jury, & Executioner');
		},
	},
};
