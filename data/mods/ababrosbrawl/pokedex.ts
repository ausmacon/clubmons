export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// joey the goon
	obstagoon: {
		inherit: true,
		baseStats: {hp: 76, atk: 109, def: 83, spa: 52, spd: 128, spe: 107},
		types: ["Electric", "Fighting"],
		abilities: {0: "Hot Headed"},
	},
	// The Cakeling
	conkeldurr: {
		inherit: true,
		baseStats: {hp: 93, atk: 150, def: 92, spa: 50, spd: 90, spe: 75},
		types: ["Fighting"],
		abilities: {0: "Safety First"},
	},
	// Krytil
	torchic: {
		inherit: true,
		baseStats: {hp: 86, atk: 85, def: 70, spa: 110, spd: 84, spe: 95},
		types: ["Fire", "Fairy"],
		abilities: {0: "On the Clock"},
	},
	moltresgalar: {
		inherit: true,
		baseStats: {hp: 86, atk: 95, def: 95, spa: 149, spd: 95, spe: 120},
		types: ["Fire", "Fairy"],
		abilities: {0: "On the Clock"},
	},
	// Ieuan
	lucario: {
		inherit: true,
		baseStats: {hp: 110, atk: 120, def: 110, spa: 30, spd: 110, spe: 55},
		abilities: {0: "Immovable Force"},
	},
	lucariomega: {
		inherit: true,
		baseStats: {hp: 110, atk: 165, def: 130, spa: 30, spd: 130, spe: 70},
		abilities: {0: "Immovable Force"},
	},
	// Shine
	spiritomb: {
		inherit: true,
		baseStats: {hp: 130, atk: 90, def: 135, spa: 50, spd: 135, spe: 1},
		abilities: {0: "Judge, Jury, & Executioner"},
	},
	// Meer
	stufful: {
		inherit: true,
		baseStats: {hp: 60, atk: 30, def: 95, spa: 60, spd: 95, spe: 10},
		types: ["Water", "Steel"],
		abilities: {0: "huh wah"},
	},
	// Eko
	jumpluff: {
		inherit: true,
		baseStats: {hp: 80, atk: 85, def: 80, spa: 85, spd: 80, spe: 130},
		types: ["Fairy", "Flying"],
		abilities: {0: "Nature's Harvest"},
	},
	// TomTom
	girafarig: {
		inherit: true,
		baseStats: {hp: 110, atk: 80, def: 80, spa: 100, spd: 70, spe: 70},
		types: ["Normal", "Psychic"],
		abilities: {0: "Inverse Room"},
	},
	zebstrika: {
		inherit: true,
		baseSpecies: "Girafarig",
		forme: "Mega",
		baseStats: {hp: 110, atk: 70, def: 120, spa: 160, spd: 140, spe: 10},
		types: ["Normal", "Psychic"],
		abilities: {0: "Inverse Room"},
	},
	// GONDA CIVIC
	gyarados: {
		inherit: true,
		baseStats: {hp: 120, atk: 100, def: 100, spa: 50, spd: 100, spe: 80},
		types: ["Water", "Ground"],
		abilities: {0: "Rough Time to Fizzle"},
	},
	gyaradosmega: {
		inherit: true,
		baseStats: {hp: 120, atk: 150, def: 125, spa: 50, spd: 125, spe: 80},
		types: ["Water", "Ground"],
		abilities: {0: "Venetian Arsenal"},
	},
	// i90
	cutiefly: {
		inherit: true,
		baseStats: {hp: 90, atk: 110, def: 130, spa: 40, spd: 75, spe: 85},
		types: ["Grass", "Fire"],
		abilities: {0: "Drought"}, 
	},
	buzzwole: {
		inherit: true,
		baseSpecies: "Cutiefly",
		forme: "Mega",
		baseStats: {hp: 90, atk: 145, def: 130, spa: 85, spd: 85, spe: 95},
		types: ["Grass", "Fire"],
		abilities: {0: "Clean Slate"},
	},
	// Tiwty
	houndoom: {
		inherit: true,
		baseStats: {hp: 90, atk: 110, def: 80, spa: 50, spd: 90, spe: 90},
		types: ["Ghost", "Fire"],
		abilities: {0: "Prankster"},
	},
	houndoommega: {
		inherit: true,
		baseStats: {hp: 90, atk: 140, def: 90, spa: 55, spd: 115, spe: 110},
		types: ["Ghost", "Fire"],
		abilities: {0: "Destruction"},
	},
	// Violet
	vileplume: {
		inherit: true,
		baseStats: {hp: 90, atk: 55, def: 100, spa: 145, spd: 100, spe: 65},
		types: ["Grass", "Ice"],
		abilities: {0: "Lofi Mix"},
	},
	grotle: {
		inherit: true,
		baseStats: {hp: 90, atk: 55, def: 100, spa: 145, spd: 100, spe: 65},
		types: ["Grass", "Ground"],
		abilities: {0: "Battle Mix"},
	},
};
