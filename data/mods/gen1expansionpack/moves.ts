/**
 * A lot of Gen 1 moves have to be updated due to different mechanics.
 * Some moves have had major changes, such as Bite's typing.
 */

export const Moves: {[k: string]: ModdedMoveData} = {
	acid: {
		inherit: true,
		category: "Physical",
		secondary: {
			chance: 33,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
	},
	amnesia: {
		inherit: true,
		boosts: {
			spd: 2,
			spa: 2,
		},
	},
	aurorabeam: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				atk: -1,
			},
		},
	},
	bide: {
		inherit: true,
		priority: 0,
		accuracy: true,
		ignoreEvasion: true,
		condition: {
			duration: 2,
			durationCallback: function (target, source, effect) {
				return this.random(3, 4);
			},
			onStart: function (pokemon) {
				this.effectData.totalDamage = 0;
				this.effectData.lastDamage = 0;
				this.add('-start', pokemon, 'Bide');
			},
			onHit: function (target, source, move) {
				if (source && source !== target && move.category !== 'Physical' && move.category !== 'Special') {
					let damage = this.effectData.totalDamage;
					this.effectData.totalDamage += damage;
					this.effectData.lastDamage = damage;
					this.effectData.sourcePosition = source.position;
					this.effectData.sourceSide = source.side;
				}
			},
			onDamage: function (damage, target, source, move) {
				if (!source || source.side === target.side) return;
				if (!move || move.effectType !== 'Move') return;
				if (!damage && this.effectData.lastDamage > 0) {
					damage = this.effectData.totalDamage;
				}
				this.effectData.totalDamage += damage;
				this.effectData.lastDamage = damage;
				this.effectData.sourcePosition = source.position;
				this.effectData.sourceSide = source.side;
			},
			onAfterSetStatus: function (status, pokemon) {
				// Sleep, freeze, and partial trap will just pause duration.
				if (pokemon.volatiles['flinch']) {
					this.effectData.duration++;
				} else if (pokemon.volatiles['partiallytrapped']) {
					this.effectData.duration++;
				} else {
					switch (status.id) {
					case 'slp':
					case 'frz':
						this.effectData.duration++;
						break;
					}
				}
			},
			onBeforeMove: function (pokemon) {
				if (this.effectData.duration === 1) {
					if (!this.effectData.totalDamage) {
						this.add('-fail', pokemon);
						return false;
					}
					this.add('-end', pokemon, 'Bide');
					let target = this.effectData.sourceSide.active[this.effectData.sourcePosition];
					// @ts-ignore
					this.moveHit(target, pokemon, 'bide', {damage: this.effectData.totalDamage * 2});
					return false;
				}
				this.add('-activate', pokemon, 'Bide');
				return false;
			},
			onDisableMove: function (pokemon) {
				if (!pokemon.hasMove('bide')) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== 'bide') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
		type: "???", // Will look as Normal but it's STAB-less
	},
	bind: {
		inherit: true,
		ignoreImmunity: true,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
	bite: {
		inherit: true,
		category: "Physical",
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		type: "Normal",
	},
	blizzard: {
		inherit: true,
		accuracy: 90,
		target: "normal",
	},
	brutalswing: {
		inherit: true,
		category: "Special",
		type: "Dark",
		gen: 1,
	},
	bubble: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
	},
	bubblebeam: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
	},
	bulletpunch: {
		inherit: true,
		category: "Physical",
		type: "Steel",
		gen: 1,
	},
	charm: {
		inherit: true,
		category: "Status",
		type: "Fairy",
		gen: 1,
	},
	clamp: {
		inherit: true,
		category: "Special",
		accuracy: 75,
		pp: 10,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
	constrict: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spe: -1,
			},
		},
	},
	conversion: {
		inherit: true,
		target: "normal",
		onHit(target, source) {
			source.setType(target.getTypes(true));
			this.add('-start', source, 'typechange', source.types.join('/'), '[from] move: Conversion', '[of] ' + target);
		},
	},
	counter: {
		inherit: true,
		desc: "Deals damage to the opposing Pokemon equal to twice the damage dealt by the last move used in the battle. This move ignores type immunity. Fails if the user moves first, or if the opposing side's last move was Counter, had 0 power, or was not Normal or Fighting type. Fails if the last move used by either side did 0 damage and was not Confuse Ray, Conversion, Focus Energy, Glare, Haze, Leech Seed, Light Screen, Mimic, Mist, Poison Gas, Poison Powder, Recover, Reflect, Rest, Soft-Boiled, Splash, Stun Spore, Substitute, Supersonic, Teleport, Thunder Wave, Toxic, or Transform.",
		ignoreImmunity: true,
		willCrit: false,
		damageCallback(pokemon, target) {
			// Counter mechanics on gen 1 might be hard to understand.
			// It will fail if the last move selected by the opponent has base power 0 or is not Normal or Fighting Type.
			// If both are true, counter will deal twice the last damage dealt in battle, no matter what was the move.
			// That means that, if opponent switches, counter will use last counter damage * 2.
			const lastUsedMove = target.side.lastMove && this.dex.getMove(target.side.lastMove.id);
			if (
				lastUsedMove && lastUsedMove.basePower > 0 && ['Normal', 'Fighting'].includes(lastUsedMove.type) &&
				this.lastDamage > 0 && !this.queue.willMove(target)
			) {
				return 2 * this.lastDamage;
			}
			this.debug("Gen 1 Counter failed due to conditions not met");
			this.add('-fail', pokemon);
			return false;
		},
	},
	crabhammer: {
		inherit: true,
		category: "Special",
		willCrit: true,
	},
	darkvoid: {
		inherit: true,
		category: "Status",
		type: "Dark",
		gen: 1,
	},
	dazzlinggleam: {
		inherit: true,
		category: "Special",
		type: "Fairy",
		gen: 1,
	},
	dig: {
		inherit: true,
		basePower: 100,
		condition: {
			duration: 2,
			onLockMove: 'dig',
			onInvulnerability(target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can\'t be hit underground!');
				return false;
			},
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source) return;
				if (move.id === 'earthquake') {
					this.add('-message', 'The foe ' + target.name + ' can\'t be hit underground!');
					return null;
				}
			},
		},
	},
	disable: {
		inherit: true,
		desc: "For 0 to 7 turns, one of the target's known moves that has at least 1 PP remaining becomes disabled, at random. Fails if one of the target's moves is already disabled, or if none of the target's moves have PP remaining. If any Pokemon uses Haze, this effect ends. Whether or not this move was successful, it counts as a hit for the purposes of the opponent's use of Rage.",
		shortDesc: "For 0-7 turns, disables one of the target's moves.",
		condition: {
			duration: 4,
			durationCallback(target, source, effect) {
				const duration = this.random(1, 7);
				return duration;
			},
			onStart(pokemon) {
				if (!this.queue.willMove(pokemon)) {
					this.effectData.duration++;
				}
				const moves = pokemon.moves;
				const move = this.dex.getMove(this.sample(moves));
				this.add('-start', pokemon, 'Disable', move.name);
				this.effectData.move = move.id;
				return;
			},
			onResidualOrder: 14,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMove(attacker, defender, move) {
				if (move.id === this.effectData.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectData.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
	},
	dizzypunch: {
		inherit: true,
		secondary: null,
	},
	doubleedge: {
		inherit: true,
		basePower: 100,
	},
	dragonrage: {
		inherit: true,
		basePower: 1,
	},
	drainingkiss: {
		inherit: true,
		category: "Special",
		type: "Fairy",
		gen: 1,
	},
	explosion: {
		inherit: true,
		basePower: 170,
		target: "normal",
	},
	fairywind: {
		inherit: true,
		category: "Special",
		type: "Fairy",
		gen: 1,
	},
	faketears: {
		inherit: true,
		category: "Status",
		type: "Dark",
		gen: 1,
	},
	falsesurrender: {
		inherit: true,
		category: "Special",
		type: "Dark",
		gen: 1,
	},
	feintattack: {
		inherit: true,
		category: "Special",
		type: "Dark",
		gen: 1,
	},
	fireblast: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
	},
	firespin: {
		inherit: true,
		accuracy: 70,
		basePower: 15,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		// FIXME: onBeforeMove(pokemon, target) {target.removeVolatile('mustrecharge')}
		onHit(target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
	flashcannon: {
		inherit: true,
		category: "Physical",
		type: "Steel",
		gen: 1,
	},
	fly: {
		inherit: true,
		condition: {
			duration: 2,
			onLockMove: 'fly',
			onInvulnerability(target, source, move) {
				if (move.id === 'swift') return true;
				this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
				return false;
			},
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move') return;
				if (!source || source.isAlly(target)) return;
				if (move.id === 'gust' || move.id === 'thunder') {
					this.add('-message', 'The foe ' + target.name + ' can\'t be hit while flying!');
					return null;
				}
			},
		},
	},
	focusenergy: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Focus Energy');
			},
			// This does nothing as it's dealt with on critical hit calculation.
			onModifyMove() {},
		},
	},
	glare: {
		inherit: true,
		ignoreImmunity: true,
	},
	growth: {
		inherit: true,
		boosts: {
			spa: 1,
			spd: 1,
		},
	},
	gust: {
		inherit: true,
		category: "Physical",
		type: "Normal",
	},
	haze: {
		inherit: true,
		onHit(target, source) {
			this.add('-activate', target, 'move: Haze');
			this.add('-clearallboost', '[silent]');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();

				if (pokemon !== source) {
					pokemon.cureStatus(true);
				}
				if (pokemon.status === 'tox') {
					pokemon.setStatus('psn');
				}
				for (const id of Object.keys(pokemon.volatiles)) {
					if (id === 'residualdmg') {
						pokemon.volatiles[id].counter = 0;
					} else {
						pokemon.removeVolatile(id);
						this.add('-end', pokemon, id, '[silent]');
					}
				}
			}
		},
		target: "self",
	},
	highjumpkick: {
		inherit: true,
		onMoveFail(target, source, move) {
			if (!target.types.includes('Ghost')) {
				this.directDamage(1, source, target);
			}
		},
	},
	hyperbeam: {
		num: 63,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
		flags: {recharge: 1, protect: 1, mirror: 1},
		self: null,
		onHit(target, source) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	irondefense: {
		inherit: true,
		category: "Status",
		type: "Steel",
		gen: 1,
	},
	ironhead: {
		inherit: true,
		category: "Physical",
		type: "Steel",
		gen: 1,
	},
	jumpkick: {
		inherit: true,
		onMoveFail(target, source, move) {
			if (!target.types.includes('Ghost')) {
				this.directDamage(1, source, target);
			}
		},
	},
	karatechop: {
		inherit: true,
		willCrit: true,
		type: "Normal",
	},
	leechseed: {
		inherit: true,
		onHit() {},
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onAfterMoveSelfPriority: 1,
			onAfterMoveSelf(pokemon) {
				const leecher = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!leecher || leecher.fainted || leecher.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				// We check if leeched Pokémon has Toxic to increase leeched damage.
				let toxicCounter = 1;
				const residualdmg = pokemon.volatiles['residualdmg'];
				if (residualdmg) {
					residualdmg.counter++;
					toxicCounter = residualdmg.counter;
				}
				const toLeech = this.clampIntRange(Math.floor(pokemon.baseMaxhp / 16), 1) * toxicCounter;
				const damage = this.damage(toLeech, pokemon, leecher);
				if (residualdmg) this.hint("In Gen 1, Leech Seed's damage is affected by Toxic's counter.", true);
				if (!damage || toLeech > damage) {
					this.hint("In Gen 1, Leech Seed recovery is not limited by the remaining HP of the seeded Pokemon.", true);
				}
				this.heal(toLeech, leecher, pokemon);
			},
		},
	},
	lightscreen: {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Light Screen",
		pp: 30,
		priority: 0,
		flags: {},
		volatileStatus: 'lightscreen',
		onTryHit(pokemon) {
			if (pokemon.volatiles['lightscreen']) {
				return false;
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Light Screen');
			},
		},
		target: "self",
		type: "Psychic",
	},
	magnetbomb: {
		inherit: true,
		category: "Physical",
		type: "Steel",
		gen: 1,
	},
	metalsound: {
		inherit: true,
		category: "Status",
		type: "Steel",
		gen: 1,
	},
	metronome: {
		inherit: true,
		noMetronome: ["Metronome", "Struggle"],
		secondary: null,
		target: "self",
		type: "Normal",
	},
	mimic: {
		inherit: true,
		onHit(target, source) {
			const moveslot = source.moves.indexOf('mimic');
			if (moveslot < 0) return false;
			const moves = target.moves;
			const moveid = this.sample(moves);
			if (!moveid) return false;
			const move = this.dex.moves.get(moveid);
			source.moveSlots[moveslot] = {
				move: move.name,
				id: move.id,
				pp: source.moveSlots[moveslot].pp,
				maxpp: move.pp * 8 / 5,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Mimic', move.name);
		},
	},
	mirrormove: {
		inherit: true,
		onHit(pokemon) {
			const foe = pokemon.side.foe.active[0];
			if (!foe?.lastMove || foe.lastMove.id === 'mirrormove') {
				return false;
			}
			this.actions.useMove(foe.lastMove.id, pokemon);
		},
	},
	mirrorshot: {
		inherit: true,
		category: "Physical",
		type: "Steel",
		gen: 1,
	},
	mist: {
		inherit: true,
	},
	naturesmadness: {
		inherit: true,
		category: "Special",
		type: "Fairy",
		gen: 1,
	},
	nastyplot: {
		inherit: true,
		boosts: {
			spd: 2,
			spa: 2,
		},
		category: "Status",
		type: "Dark",
		gen: 1,
	},
	nightshade: {
		inherit: true,
		category: "Physical",
		ignoreImmunity: true,
		basePower: 1,
	},
	nightslash: {
		inherit: true,
		category: "Special",
		type: "Dark",
		gen: 1,
	},
	playrough: {
		inherit: true,
		category: "Special",
		type: "Fairy",
		gen: 1,
	},
	poisonsting: {
		inherit: true,
		secondary: {
			chance: 20,
			status: 'psn',
		},
	},
	psychic: {
		inherit: true,
		secondary: {
			chance: 33,
			boosts: {
				spd: -1,
				spa: -1,
			},
		},
	},
	psywave: {
		inherit: true,
		basePower: 1,
		damageCallback(pokemon) {
			const psywaveDamage = (this.random(0, this.trunc(1.5 * pokemon.level)));
			if (psywaveDamage <= 0) {
				this.hint("Desync Clause Mod activated!");
				return false;
			}
			return psywaveDamage;
		},
	},
	rage: {
		inherit: true,
		self: {
			volatileStatus: 'rage',
		},
		condition: {
			// Rage lock
			duration: 255,
			onStart: function (target, source, effect) {
				this.effectData.move = 'rage';
			},
			onLockMove: 'rage',
			onTryHit: function (target, source, move) {
				if (target.boosts.atk < 6 && move.id === 'disable') {
					this.boost({atk: 1});
				}
			},
			onHit: function (target, source, move) {
				if (target.boosts.atk < 6 && move.category !== 'Status') {
					this.boost({atk: 1});
				}
			},
		},
	},
	razorleaf: {
		inherit: true,
		category: "Special",
		willCrit: true,
		target: "normal",
	},
	razorwind: {
		inherit: true,
		category: "Physical",
		critRatio: 1,
		target: "normal",
	},
	recover: {
		inherit: true,
		heal: null,
		onHit(target) {
			if (target.hp === target.maxhp) return false;
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256.");
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
	},
	reflect: {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Reflect",
		pp: 20,
		priority: 0,
		flags: {},
		volatileStatus: 'reflect',
		onTryHit(pokemon) {
			if (pokemon.volatiles['reflect']) {
				return false;
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Reflect');
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	rest: {
		inherit: true,
	},
	roar: {
		inherit: true,
		forceSwitch: false,
		onTryHit() {},
		priority: 0,
	},
	rockslide: {
		inherit: true,
		secondary: null,
		target: "normal",
	},
	rockthrow: {
		inherit: true,
		accuracy: 65,
	},
	sandattack: {
		inherit: true,
		ignoreImmunity: true,
		type: "Normal",
	},
	seismictoss: {
		inherit: true,
		ignoreImmunity: true,
		basePower: 1,
	},
	selfdestruct: {
		inherit: true,
		basePower: 130,
		target: "normal",
	},
	skullbash: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	slash: {
		inherit: true,
		willCrit: true,
	},
	sludge: {
		inherit: true,
		category: "Physical",
		secondary: {
			chance: 40,
			status: 'psn',
		},
	},
	smartstrike: {
		inherit: true,
		category: "Physical",
		type: "Steel",
		gen: 1,
	},
	softboiled: {
		inherit: true,
		heal: null,
		onHit(target) {
			if (target.hp === target.maxhp) return false;
			// Fail when health is 255 or 511 less than max
			if (target.hp === (target.maxhp - 255) || target.hp === (target.maxhp - 511) || target.hp === target.maxhp) {
				this.hint("In Gen 1, recovery moves fail if (user's maximum HP - user's current HP + 1) is divisible by 256.");
				return false;
			}
			this.heal(Math.floor(target.maxhp / 2), target, target);
		},
	},
	struggle: {
		inherit: true,
		pp: 10,
		recoil: [1, 2],
		onModifyMove() {},
	},
	substitute: {
		inherit: true,
	},
	superfang: {
		inherit: true,
		ignoreImmunity: true,
		basePower: 1,
	},
	sweetkiss: {
		inherit: true,
		category: "Status",
		type: "Fairy",
		gen: 1,
	},
	thunder: {
		inherit: true,
		secondary: {
			chance: 10,
			status: 'par',
		},
	},
	thunderwave: {
		inherit: true,
		accuracy: 100,
		onTryHit(target) {
			if (target.hasType('Ground')) {
				this.add('-immune', target);
				return null;
			}
		},
	},
	triattack: {
		inherit: true,
		category: "Physical",
		onHit() {},
		secondary: null,
	},
	whirlwind: {
		inherit: true,
		accuracy: 85,
		forceSwitch: false,
		onTryHit() {},
		priority: 0,
	},
	wingattack: {
		inherit: true,
		basePower: 35,
	},
	wrap: {
		inherit: true,
		accuracy: 85,
		ignoreImmunity: true,
		volatileStatus: 'partiallytrapped',
		self: {
			volatileStatus: 'partialtrappinglock',
		},
		onBeforeMove: function (pokemon, target, move) {
			// Removes must recharge volatile even if it misses
			target.removeVolatile('mustrecharge');
		},
		onHit: function (target, source) {
			/**
			 * The duration of the partially trapped must be always renewed to 2
			 * so target doesn't move on trapper switch out as happens in gen 1.
			 * However, this won't happen if there's no switch and the trapper is
			 * about to end its partial trapping.
			 **/
			if (target.volatiles['partiallytrapped']) {
				if (source.volatiles['partialtrappinglock'] && source.volatiles['partialtrappinglock'].duration > 1) {
					target.volatiles['partiallytrapped'].duration = 2;
				}
			}
		},
	},
};
