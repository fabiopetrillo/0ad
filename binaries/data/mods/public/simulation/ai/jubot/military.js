/*
 * Military strategy:
 *   * Try training an attack squad of a specified size
 *   * When it's the appropriate size, send it to attack the enemy
 *   * Repeat forever
 *
 */

var MilitaryAttackManager = Class({

	_init: function()
	{
		this.baserate = 11;
		this.defsquad = 10;
		this.defsquadmin = 2;
		this.findatype = 1;
		this.killstrat = 3;
		this.changetime = 60*1000;
		this.changetimeReg = 60*5000;
		this.changetimeRegDef = 60*5000;
		this.attacknumbers = 0.4
		this.squadTypes = [
			"units/{civ}_infantry_spearman_b",
			"units/{civ}_infantry_javelinist_b",
//			"units/{civ}_infantry_archer_b", // TODO: should only include this if hele
		];
	},

	/**
	 * Returns the unit type we should begin training.
	 * (Currently this is whatever we have least of.)
	 */
	findBestNewUnit: function(gameState)
	{
		// Count each type
		var types = [];
		for each (var t in this.squadTypes)
			types.push([t, gameState.countEntitiesAndQueuedWithType(t)]);

		// Sort by increasing count
		types.sort(function (a, b) { return a[1] - b[1]; });

		// TODO: we shouldn't return units that we don't have any
		// buildings capable of training
		// Let's make this shizz random...
		var randomiser = Math.floor(Math.random()*types.length);
		return types[randomiser][0];
	},

	regroup: function(gameState, planGroups)
	{
			if (gameState.getTimeElapsed() > this.changetimeReg && this.killstrat != 3){
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p1");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p2");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p3");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack-pending_3p1");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack-pending_3p2");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack-pending_3p3");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("fighting");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending");
				});
			var regroupneededPartB = gameState.getOwnEntitiesWithRole("attack-pending");
				//Find a friendsly CC
			var targets = gameState.entities.filter(function(ent) {
				return (!ent.isEnemy() && ent.hasClass("CivCentre"));
			});
			if (targets.length){
				var target = targets.toEntityArray()[0];
				var targetPos = target.position();

				// TODO: this should be an attack-move command
				regroupneededPartB.move(targetPos[0], targetPos[1]);
			}
			// Wait 4 mins to do this again.
			this.changetimeReg = this.changetimeReg + (60*4000);
			}
			else if (gameState.getTimeElapsed() > this.changetimeReg && this.killstrat == 3){
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack");
				regroupneeded.forEach(function(ent) {
					var section = Math.random();
					if (section < 0.3){
					ent.setMetadata("role", "attack-pending_3p1");
					}
					else if (section < 0.6){
					ent.setMetadata("role", "attack-pending_3p2");
					}
					else {
					ent.setMetadata("role", "attack-pending_3p3");
					}
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack-pending");
				regroupneeded.forEach(function(ent) {
					var section = Math.random();
					if (section < 0.3){
					ent.setMetadata("role", "attack-pending_3p1");
					}
					else if (section < 0.6){
					ent.setMetadata("role", "attack-pending_3p2");
					}
					else {
					ent.setMetadata("role", "attack-pending_3p3");
					}
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p1");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending_3p1");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p2");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending_3p2");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p3");
				regroupneeded.forEach(function(ent) {
					ent.setMetadata("role", "attack-pending_3p3");
				});
			var regroupneeded = gameState.getOwnEntitiesWithRole("fighting");
				regroupneeded.forEach(function(ent) {
					var section = Math.random();
					if (section < 0.3){
					ent.setMetadata("role", "attack-pending_3p1");
					}
					else if (section < 0.6){
					ent.setMetadata("role", "attack-pending_3p2");
					}
					else {
					ent.setMetadata("role", "attack-pending_3p3");
					}
				});
			var regroupneededPartB = gameState.getOwnEntitiesWithRole("attack-pending");
				//Find a friendsly CC
			var targets = gameState.entities.filter(function(ent) {
				return (!ent.isEnemy() && ent.hasClass("CivCentre"));
			});
			if (targets.length){
				var target = targets.toEntityArray()[0];
				var targetPos = target.position();

				// TODO: this should be an attack-move command
				regroupneededPartB.move(targetPos[0], targetPos[1]);
			}
			// Wait 4 mins to do this again.
			this.changetimeReg = this.changetimeReg + (60*4000);
			}
	},
	
	combatcheck: function(gameState, planGroups)
	{
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack");
				regroupneeded.forEach(function(troop) {
				var currentPosition = troop.position();
			var targets = gameState.entities.filter(function(ent) {
				var foeposition = ent.position();
				if (foeposition){
				var dist = VectorDistance(foeposition, currentPosition);
				return (ent.isEnemy() && ent.owner()!= 0 && dist < 50);
				}
			});
			if (targets.length >= 5){
				regroupneeded.forEach(function(person) {
				var targetrandomiser = Math.floor(Math.random()*targets.length);
				var target = targets.toEntityArray()[targetrandomiser];
				var targetPos = target.position();
				// TODO: this should be an attack-move command
				person.move(targetPos[0], targetPos[1]);
				person.setMetadata("role", "fighting");
				});
			}
				});
	},
	
	combatcheck3p1: function(gameState, planGroups)
	{
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p1");
				regroupneeded.forEach(function(troop) {
				var currentPosition = troop.position();
			var targets = gameState.entities.filter(function(ent) {
				var foeposition = ent.position();
				if (foeposition){
				var dist = VectorDistance(foeposition, currentPosition);
				return (ent.isEnemy() && ent.owner()!= 0 && dist < 50);
				}
			});
			if (targets.length >= 5){
				regroupneeded.forEach(function(person) {
				var targetrandomiser = Math.floor(Math.random()*targets.length);
				var target = targets.toEntityArray()[targetrandomiser];
				var targetPos = target.position();
				// TODO: this should be an attack-move command
				person.move(targetPos[0], targetPos[1]);
				person.setMetadata("role", "fighting");
				});
			}
				});
	},	
	combatcheck3p2: function(gameState, planGroups)
	{
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p2");
				regroupneeded.forEach(function(troop) {
				var currentPosition = troop.position();
			var targets = gameState.entities.filter(function(ent) {
				var foeposition = ent.position();
				if (foeposition){
				var dist = VectorDistance(foeposition, currentPosition);
				return (ent.isEnemy() && ent.owner()!= 0 && dist < 50);
				}
			});
			if (targets.length >= 5){
				regroupneeded.forEach(function(person) {
				var targetrandomiser = Math.floor(Math.random()*targets.length);
				var target = targets.toEntityArray()[targetrandomiser];
				var targetPos = target.position();
				// TODO: this should be an attack-move command
				person.move(targetPos[0], targetPos[1]);
				person.setMetadata("role", "fighting");
				});
			}
				});
	},	
	combatcheck3p3: function(gameState, planGroups)
	{
			var regroupneeded = gameState.getOwnEntitiesWithRole("attack_3p3");
				regroupneeded.forEach(function(troop) {
				var currentPosition = troop.position();
			var targets = gameState.entities.filter(function(ent) {
				var foeposition = ent.position();
				if (foeposition){
				var dist = VectorDistance(foeposition, currentPosition);
				return (ent.isEnemy() && ent.owner()!= 0 && dist < 50);
				}
			});
			if (targets.length >= 5){
				regroupneeded.forEach(function(person) {
				var targetrandomiser = Math.floor(Math.random()*targets.length);
				var target = targets.toEntityArray()[targetrandomiser];
				var targetPos = target.position();
				// TODO: this should be an attack-move command
				person.move(targetPos[0], targetPos[1]);
				person.setMetadata("role", "fighting");
				});
			}
				});
	},
	defenseregroup: function(gameState, planGroups)
	{
			if (gameState.getTimeElapsed() > this.changetimeRegDef){
			var defenseregroupers = gameState.getOwnEntitiesWithRole("defenders");
				//Find a friendsly CC
			var targets = gameState.entities.filter(function(ent) {
				return (!ent.isEnemy() && ent.hasClass("CivCentre"));
			});
			if (targets.length){
				var target = targets.toEntityArray()[0];
				var targetPos = target.position();

				// TODO: this should be an attack-move command
				defenseregroupers.move(targetPos[0], targetPos[1]);
			}
			// Wait 4 mins to do this again.
			this.changetimeRegDef = this.changetimeRegDef + (60*1500);
			}
	},
		
	trainDefenderSquad: function(gameState, planGroups)
	{
		var pendingdefense = gameState.getOwnEntitiesWithRole("defenders");
		//TestBotAI.prototype.chat("Number of defenders is" + pendingdefense.length);
			if (pendingdefense.length < this.defsquadmin && gameState.displayCiv() == "iber"){
			planGroups.economyPersonnel.addPlan(122,
				new UnitTrainingPlan(gameState,
					"units/{civ}_infantry_swordsman_b", 3, { "role": "defenders" })
			);
			}
			else if (pendingdefense.length < this.defsquadmin){
			planGroups.economyPersonnel.addPlan(122,
				new UnitTrainingPlan(gameState,
					"units/{civ}_infantry_spearman_b", 3, { "role": "defenders" })
			);
		//TestBotAI.prototype.chat("Training defenders");
			}
			else if (pendingdefense.length < this.defsquad && gameState.displayCiv() == "iber"){
			planGroups.economyPersonnel.addPlan(110,
				new UnitTrainingPlan(gameState,
					"units/{civ}_infantry_swordsman_b", 3, { "role": "defenders" })
			);
		//TestBotAI.prototype.chat("Training defenders");
			}
			else if (pendingdefense.length < this.defsquad){
			planGroups.economyPersonnel.addPlan(110,
				new UnitTrainingPlan(gameState,
					"units/{civ}_infantry_spearman_b", 3, { "role": "defenders" })
			);
		//TestBotAI.prototype.chat("Training defenders");
			}
	},
	
	trainSomeTroops: function(gameState, planGroups, type)
	{
			var trainers = gameState.findTrainers(gameState.applyCiv(type));
			if (trainers.length != 0){
			planGroups.economyPersonnel.addPlan(100,
				new UnitTrainingPlan(gameState,
					type, 3, { "role": "attack-pending" })
			);
			}
			else {
			this.attacknumbers = 0.9;			
			}
	},
	
	trainMachine: function(gameState, planGroups, type)
	{
			var trainers = gameState.findTrainers(gameState.applyCiv(type));
			if (trainers.length != 0){
			planGroups.economyPersonnel.addPlan(100,
				new UnitTrainingPlan(gameState,
					type, 1, { "role": "attack-pending" })
			);
			}
			else {
			this.attacknumbers = 0.9;			
			}
	},
	
	trainSomeTroops3prong: function(gameState, planGroups, type)
	{
			var trainers = gameState.findTrainers(gameState.applyCiv(type));
			var section = Math.random();
			if (trainers.length != 0 && section < 0.3){
			planGroups.economyPersonnel.addPlan(100,
				new UnitTrainingPlan(gameState,
					type, 3, { "role": "attack-pending_3p1" })
			);
			}
			else if (trainers.length != 0 && section < 0.6){
			planGroups.economyPersonnel.addPlan(100,
				new UnitTrainingPlan(gameState,
					type, 3, { "role": "attack-pending_3p2" })
			);
			}
			else if (trainers.length != 0){
			planGroups.economyPersonnel.addPlan(100,
				new UnitTrainingPlan(gameState,
					type, 3, { "role": "attack-pending_3p3" })
			);
			}
			else {
			this.attacknumbers = 0.9;			
			}
	},
	
	trainAttackSquad: function(gameState, planGroups)
	{
			if (gameState.getTimeElapsed() > this.changetime){
			this.attacknumbers = Math.random();
			this.changetime = this.changetime + (60*1000);
			}
			// Training lists for full assaults
			if (this.killstrat == 1){
			//Greeks
				if (gameState.displayCiv() == "hele"){
					if (this.attacknumbers < 0.19){
					this.trainSomeTroops(gameState, planGroups, "units/hele_super_infantry_polis");
					}
					else if (this.attacknumbers < 0.26){
					this.trainSomeTroops(gameState, planGroups, "units/hele_super_ranged_polis");
					}
					else if (this.attacknumbers < 0.35){
					this.trainSomeTroops(gameState, planGroups, "units/hele_super_cavalry_mace");
					}
					else if (this.attacknumbers < 0.45){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_archer_b");
					}
					else if (this.attacknumbers < 0.55){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_swordsman_b");
					}
					else if (this.attacknumbers < 0.65){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_javelinist_b");
					}
					else if (this.attacknumbers < 0.75){
					this.trainMachine(gameState, planGroups, "units/hele_mechanical_siege_lithobolos");
					}
					else {
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
				}
			//Celts
				else if (gameState.displayCiv() == "celt"){
					if (this.attacknumbers < 0.25){
					this.trainSomeTroops(gameState, planGroups, "units/celt_super_infantry_brit");
					}
					else if (this.attacknumbers < 0.45){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_swordsman_b");
					}
					else if (this.attacknumbers < 0.6){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_javelinist_b");
					}
					else if (this.attacknumbers < 0.7){
					this.trainMachine(gameState, planGroups, "units/celt_mechanical_siege_ram");
					}
					else {
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
				}
			//Iberians
				else if (gameState.displayCiv() == "iber"){
					if (this.attacknumbers < 0.2){
					this.trainSomeTroops(gameState, planGroups, "units/iber_super_infantry");
					}
					else if (this.attacknumbers < 0.3){
					this.trainSomeTroops(gameState, planGroups, "units/iber_super_cavalry");
					}
					else if (this.attacknumbers < 0.4){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_slinger_b");
					}
					else if (this.attacknumbers < 0.5){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
					else if (this.attacknumbers < 0.6){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_spearman_b");
					}
					else if (this.attacknumbers < 0.7){
					this.trainMachine(gameState, planGroups, "units/iber_mechanical_siege_ram");
					}
					else {
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_swordsman_b");
					}
				}
			}
			// Cav raiders training list
			else if (this.killstrat == 2){
			if (this.attacknumbers < 0.4 && gameState.displayCiv() == "hele"){
			this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_javelinist_b");
			}
			else if (this.attacknumbers < 0.25 && gameState.displayCiv() == "celt"){
			this.trainSomeTroops(gameState, planGroups, "units/celt_super_cavalry_brit");
			}
			else if (this.attacknumbers < 0.35 && gameState.displayCiv() == "iber"){
			this.trainSomeTroops(gameState, planGroups, "units/iber_super_cavalry");
			}
			else if (this.attacknumbers < 0.6 && gameState.displayCiv() == "celt"){
			this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_swordsman_b");
			}
			else if (this.attacknumbers < 0.6 && gameState.displayCiv() == "hele"){
			this.trainSomeTroops(gameState, planGroups, "units/hele_super_cavalry_mace");
			}
			else if  (gameState.displayCiv() == "iber"){
			this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_spearman_b");
			}
			else if  (gameState.displayCiv() == "celt"){
			this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_javelinist_b");
			}
			else if  (gameState.displayCiv() == "hele"){
			this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_swordsman_b");
			}
			}
			// 3 prong attack training list
			else if (this.killstrat == 3){
			//Greeks
				if (gameState.displayCiv() == "hele"){
					if (this.attacknumbers < 0.25){
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_archer_b");
					}
					else if (this.attacknumbers < 0.5){
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_javelinist_b");
					}
					else {
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
				}
			//Celts
				else if (gameState.displayCiv() == "celt"){
					if (this.attacknumbers < 0.45){
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_cavalry_swordsman_b");
					}
					else if (this.attacknumbers < 0.6){
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_javelinist_b");
					}
					else {
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
				}
			//Iberians
				else if (gameState.displayCiv() == "iber"){
					if (this.attacknumbers < 0.2){
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_cavalry_spearman_b");
					}
					else if (this.attacknumbers < 0.4){
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_slinger_b");
					}
					else {
					this.trainSomeTroops3prong(gameState, planGroups, "units/{civ}_infantry_swordsman_b");
					}
			}
			}
			// Generic training list
			else {
			//Greeks
				if (gameState.displayCiv() == "hele"){
					if (this.attacknumbers < 0.25){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_archer_b");
					}
					else if (this.attacknumbers < 0.5){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_javelinist_b");
					}
					else {
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
				}
			//Celts
				else if (gameState.displayCiv() == "celt"){
					if (this.attacknumbers < 0.45){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_swordsman_b");
					}
					else if (this.attacknumbers < 0.6){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_javelinist_b");
					}
					else {
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_spearman_b");
					}
				}
			//Iberians
				else if (gameState.displayCiv() == "iber"){
					if (this.attacknumbers < 0.2){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_cavalry_spearman_b");
					}
					else if (this.attacknumbers < 0.4){
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_slinger_b");
					}
					else {
					this.trainSomeTroops(gameState, planGroups, "units/{civ}_infantry_swordsman_b");
					}
				}
			}
	},
	
	update: function(gameState, planGroups)
	{
		// Pause for a minute before starting any work, to give the economy a chance
		// to start up
		if (gameState.getTimeElapsed() < 60*1000)
			return;

		Engine.ProfileStart("military update");
		// Also train up some defenders

		this.combatcheck(gameState, planGroups);
		this.combatcheck3p1(gameState, planGroups);
		this.combatcheck3p2(gameState, planGroups);
		this.combatcheck3p3(gameState, planGroups);
		this.trainDefenderSquad(gameState, planGroups);
		this.trainAttackSquad(gameState, planGroups);
		this.regroup(gameState, planGroups);
		this.defenseregroup(gameState, planGroups);

// Variable for impetuousness, so squads vary in size.
		if (this.killstrat == 1){
		this.baserate = 31;
		}
		else if (this.killstrat == 2) {
		this.baserate = 10;
		}
		else if (this.killstrat == 3) {
		this.baserate = 8;
		}
		else {
		this.baserate = 15;
		}
		// Check we're doing a normal, not 3 pronged, attack
		if (this.killstrat != 3){
		// Find the units ready to join the attack
		var pending = gameState.getOwnEntitiesWithRole("attack-pending");
		if (pending.length >= this.baserate)
		{
		//Point full assaults at civ centres
		if (this.killstrat == 1){
			// Find the enemy CCs we could attack
			var targets = gameState.entities.filter(function(ent) {
				return (ent.isEnemy() && ent.hasClass("CivCentre"));
			});

			// If there's no CCs, attack anything else that's critical
			if (targets.length == 0)
			{
				targets = gameState.entities.filter(function(ent) {
					return (ent.isEnemy() && ent.hasClass("ConquestCritical"));
				});
			}
		}
		//Other attacks can go to any low-level structure
		else {
			var targets = gameState.entities.filter(function(ent) {
				return (ent.isEnemy() && ent.hasClass("Village"));
			});
		}

			// If we have a target, move to it
			if (targets.length)
			{
				// Remove the pending role
				pending.forEach(function(ent) {
					ent.setMetadata("role", "attack");
				});
				var targetrandomiser = Math.floor(Math.random()*targets.length);
				var target = targets.toEntityArray()[targetrandomiser];
				var targetPos = target.position();
				// TODO: this should be an attack-move command
				pending.move(targetPos[0], targetPos[1]);
				var otherguys = gameState.getOwnEntitiesWithRole("randomcannonfodder");
				otherguys.move(targetPos[0], targetPos[1]);
			}
			//Now set whether to do a raid or full attack next time
			var whatnext = Math.random();
			if (whatnext > 0.85){
			this.killstrat = 0;
			// Regular "train a few guys and go kill stuff" type attack.
		//TestBotAI.prototype.chat("Regular attack (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			}
			else if (whatnext > 0.55) {
			this.killstrat = 2;
		//TestBotAI.prototype.chat("Cavalry raid (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			// Cavalry raid
			}
			else if (whatnext > 0.2) {
			this.killstrat = 3;
		//TestBotAI.prototype.chat("3 pronged assault (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			// 3 prong
			}
			else {
			this.killstrat = 1;
		//TestBotAI.prototype.chat("Full assault (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			//Full Assault!
			}
		}
		}
		// Here's the 3 pronged attack
		else{
		// Find the units ready to join the attack
		var pending1 = gameState.getOwnEntitiesWithRole("attack-pending_3p1");
		var pending2 = gameState.getOwnEntitiesWithRole("attack-pending_3p2");
		var pending3 = gameState.getOwnEntitiesWithRole("attack-pending_3p3");
		if (pending1.length >= this.baserate && pending2.length >= this.baserate && pending3.length >= this.baserate)
		{
		//Copy the target selector 3 times, once per attack squad
			var targets1 = gameState.entities.filter(function(ent) {
				return (ent.isEnemy() && ent.hasClass("Village"));
			});
			// If we have a target, move to it
			if (targets1.length)
			{
				// Remove the pending role
				pending1.forEach(function(ent) {
					ent.setMetadata("role", "attack_3p1");
				});
				var targetrandomiser1 = Math.floor(Math.random()*targets1.length);
				var target1 = targets1.toEntityArray()[targetrandomiser1];
				var targetPos1 = target1.position();
				pending1.move(targetPos1[0], targetPos1[1]);
				var otherguys = gameState.getOwnEntitiesWithRole("randomcannonfodder");
				otherguys.move(targetPos1[0], targetPos1[1]);
			}
			var targets2 = gameState.entities.filter(function(ent) {
				return (ent.isEnemy() && ent.hasClass("Village"));
			});
			// If we have a target, move to it
			if (targets2.length)
			{
				// Remove the pending role
				pending2.forEach(function(ent) {
					ent.setMetadata("role", "attack_3p2");
				});
				var targetrandomiser2 = Math.floor(Math.random()*targets2.length);
				var target2 = targets2.toEntityArray()[targetrandomiser2];
				var targetPos2 = target2.position();
				pending2.move(targetPos2[0], targetPos2[1]);
			}
			var targets3 = gameState.entities.filter(function(ent) {
				return (ent.isEnemy() && ent.hasClass("Village"));
			});
			// If we have a target, move to it
			if (targets3.length)
			{
				// Remove the pending role
				pending3.forEach(function(ent) {
					ent.setMetadata("role", "attack_3p3");
				});
				var targetrandomiser3 = Math.floor(Math.random()*targets3.length);
				var target3 = targets3.toEntityArray()[targetrandomiser3];
				var targetPos3 = target3.position();
				pending3.move(targetPos3[0], targetPos3[1]);
			}
			//Now set whether to do a raid or full attack next time
			var whatnext = Math.random();
			if (whatnext > 0.8){
			this.killstrat = 0;
			// Regular "train a few guys and go kill stuff" type attack.
		//TestBotAI.prototype.chat("Regular attack (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			}
			else if (whatnext > 0.5) {
			this.killstrat = 2;
		//TestBotAI.prototype.chat("Cavalry raid (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			// Cavalry raid
			}
			else if (whatnext > 0.3) {
			this.killstrat = 3;
		//TestBotAI.prototype.chat("3 pronged assault (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			// 3 prong
			}
			else {
			this.killstrat = 1;
		//TestBotAI.prototype.chat("Full assault (" + gameState.displayCiv() + ")");
		//TestBotAI.prototype.chat(whatnext);
			//Full Assault!
			}
		}
		}


		Engine.ProfileStop();
	},

});
