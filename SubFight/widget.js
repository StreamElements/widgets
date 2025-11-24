let fieldData;
let isEditorMode = false;

// Battle state management
class BattleStateMachine {
    constructor() {
        this.state = 'idle'; // idle, round_A, round_B, results
        this.optionA = '';
        this.optionB = '';
        this.pointsA = 0;
        this.pointsB = 0;
        this.roundDuration = 0;
        this.currentRoundTimeLeft = 0;
        this.roundTimer = null;
        this.activeOption = '';
    }

    startBattle(optionA, optionB, duration) {
        // Check if battle is already in progress
        if (this.state !== 'idle') {
            console.log('Battle already in progress. Current state:', this.state);
            return false; // Return false to indicate battle could not be started
        }

        this.optionA = optionA;
        this.optionB = optionB;
        this.pointsA = 0;
        this.pointsB = 0;
        this.roundDuration = duration;
        this.state = 'round_A';
        this.activeOption = optionA;
        this.currentRoundTimeLeft = duration;
        this.startRoundTimer();
        this.updateDisplay();
        this.saveState();
        return true; // Return true to indicate battle started successfully
    }

    nextRound() {
        if (this.state === 'round_A') {
            this.state = 'round_B';
            this.activeOption = this.optionB;
            this.currentRoundTimeLeft = this.roundDuration;
            this.startRoundTimer();
        } else if (this.state === 'round_B') {
            this.endBattle();
        }
        this.updateDisplay();
        this.saveState();
    }

    endBattle() {
        this.state = 'results';
        this.activeOption = '';
        this.clearTimer();
        this.updateDisplay();
        this.saveState();
        
        // Auto-reset to idle after 10 seconds
        setTimeout(() => {
            this.reset();
        }, 10000);
    }

    reset() {
        this.state = 'idle';
        this.optionA = '';
        this.optionB = '';
        this.pointsA = 0;
        this.pointsB = 0;
        this.activeOption = '';
        this.clearTimer();
        this.updateDisplay();
        this.saveState();
    }

    addPoints(points) {
        if (this.state === 'round_A') {
            this.pointsA += points;
        } else if (this.state === 'round_B') {
            this.pointsB += points;
        }
        this.updateDisplay();
        this.saveState();
    }

    startRoundTimer() {
        this.clearTimer();
        this.roundTimer = setInterval(() => {
            this.currentRoundTimeLeft--;
            this.updateDisplay();
            if (this.currentRoundTimeLeft <= 0) {
                this.nextRound();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.roundTimer) {
            clearInterval(this.roundTimer);
            this.roundTimer = null;
        }
    }

    updateDisplay() {
        this.updateProgressBars();
        this.updateTimer();
        this.updateStatus();
    }

    updateProgressBars() {
        const totalPoints = this.pointsA + this.pointsB;
        const percentageA = totalPoints > 0 ? (this.pointsA / totalPoints) * 100 : 50;
        const percentageB = totalPoints > 0 ? (this.pointsB / totalPoints) * 100 : 50;

        $('#bar1').css('flex', percentageA + '%');
        $('#bar2').css('flex', percentageB + '%');
        
        $('#pointsA').text(this.pointsA);
        $('#pointsB').text(this.pointsB);
        $('#labelA').text(this.optionA);
        $('#labelB').text(this.optionB);
    }

    updateTimer() {
        if (this.state === 'round_A' || this.state === 'round_B') {
            const minutes = Math.floor(this.currentRoundTimeLeft / 60);
            const seconds = this.currentRoundTimeLeft % 60;
            $('#countdown').text(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else if (this.state === 'results') {
            const winner = this.pointsA > this.pointsB ? this.optionA : this.optionB;
            const winnerPoints = this.pointsA > this.pointsB ? this.pointsA : this.pointsB;
            const loserPoints = this.pointsA > this.pointsB ? this.pointsB : this.pointsA;
            $('#countdown').text(`${winner} won with ${winnerPoints} points, ${this.pointsA > this.pointsB ? this.optionB : this.optionA} had ${loserPoints}`);
        } else {
            $('#countdown').text('0:00');
        }
    }

    updateStatus() {
        // Status is now handled by visibility and helper text
        this.updateVisibility();
    }

    updateVisibility() {
        const container = $('#battleContainer');
        const helperText = $('#helperText');
        const demoSection = $('#demoSection');

        if (this.state === 'idle') {
            container.hide();
            if (isEditorMode) {
                helperText.show();
                demoSection.show();
            } else {
                helperText.hide();
                demoSection.hide();
            }
        } else {
            container.show();
            helperText.hide();
            demoSection.hide();
        }
    }

    saveState() {
        SE_API.store.set('battle', {
            state: this.state,
            optionA: this.optionA,
            optionB: this.optionB,
            pointsA: this.pointsA,
            pointsB: this.pointsB,
            roundDuration: this.roundDuration,
            currentRoundTimeLeft: this.currentRoundTimeLeft,
            activeOption: this.activeOption
        });
    }

    loadState() {
        SE_API.store.get('battle').then(obj => {
            if (obj !== null) {
                this.state = obj.state;
                this.optionA = obj.optionA;
                this.optionB = obj.optionB;
                this.pointsA = obj.pointsA;
                this.pointsB = obj.pointsB;
                this.roundDuration = obj.roundDuration;
                this.currentRoundTimeLeft = obj.currentRoundTimeLeft;
                this.activeOption = obj.activeOption;

                if (this.state === 'round_A' || this.state === 'round_B') {
                    this.startRoundTimer();
                }
                this.updateDisplay();
            }
        });
    }
}

// Initialize battle state machine
const battleState = new BattleStateMachine();

// Event handlers configuration - now for points instead of time
const eventHandlers = {
    'follower-latest': (data) => {
        if (fieldData.followPoints !== 0) {
            battleState.addPoints(fieldData.followPoints);
        }
    },
    
    'subscriber-latest': (data) => {
        // Skip gift subscriptions if configured
        if (data.sender && fieldData.subIgnoreGifts) {
            return;
        }
        // Skip bulk gifted events (count only real subs)
        if (data.bulkGifted && data.name === data.sender) {
            return;
        }
        
        const tier = parseInt(data.tier);
        const pointsMap = {
            2000: fieldData.sub2Points,
            3000: fieldData.sub3Points,
            1000: fieldData.sub1Points
        };
        
        const points = pointsMap[tier] || fieldData.sub1Points;
        if (points !== 0) {
            battleState.addPoints(points);
        }
    },
    
    'raid-latest': (data) => {
        if (data.amount < fieldData.raidMin || fieldData.raidPoints === 0) {
            return;
        }
        battleState.addPoints(fieldData.raidPoints * data.amount);
    },
    
    'cheer-latest': (data) => {
        if (data.amount < fieldData.cheerMin || fieldData.cheerPoints === 0) {
            return;
        }
        battleState.addPoints(parseInt(fieldData.cheerPoints * data.amount / 100));
    },
    
    'tip-latest': (data) => {
        if (data.amount < fieldData.tipMin || fieldData.tipPoints === 0) {
            return;
        }
        battleState.addPoints(parseInt(fieldData.tipPoints * data.amount));
    },
    
    'merch-latest': (data) => {
        if (fieldData.merchPoints === 0) {
            return;
        }
        battleState.addPoints(parseInt(fieldData.merchPoints * data.amount));
    },
    
    'purchase-latest': (data) => {
        if (fieldData.purchasePoints === 0) {
            return;
        }
        battleState.addPoints(parseInt(fieldData.purchasePoints * data.amount));
    }
};

const handleEvent = (listener, data) => {
    const handler = eventHandlers[listener];
    if (handler) {
        handler(data);
    }
};

// Parse VS command: !vs [seconds] [option A]; [option B]
function parseVsCommand(command) {
    const vsCommand = fieldData.vsCommand || '!vs';
    if (!command.startsWith(vsCommand)) {
        return { success: false, error: 'Invalid command format' };
    }

    // Handle reset command
    if (command.trim() === `${fieldData.vsCommand} reset`) {
        return { success: true, type: 'reset' };
    }

    // Handle end command
    if (command.trim() === `${fieldData.vsCommand} end`) {
        return { success: true, type: 'end' };
    }

    // Handle battle start command
    const params = command.replace(vsCommand, ' ').split(';');
    
    if (params.length !== 3) {
        return { success: false, error: 'Invalid format. Use: !vs [seconds];[option A];[option B] | !vs reset | !vs end' };
    }

    const seconds = parseInt(params[0]);
    if (isNaN(seconds)) {
        return { success: false, error: 'Seconds must be a number' };
    }
    if (seconds <= 0) {
        return { success: false, error: 'Seconds must be a positive number' };
    }
    const optionA = params[1].trim();
    const optionB = params[2].trim();    

    if (!optionA || !optionB) {
        return { success: false, error: 'Both options must be provided' };
    }

    return { success: true, type: 'start', seconds, optionA, optionB };
}

// Check if user has permission to start battles
function hasPermission(userstate, nick, channel) {
    const isMod = userstate.mod && fieldData.managePermissions === 'mods';
    const isBroadcaster = userstate.badges.broadcaster;
    const isAdditionalUser = fieldData.additionalUsers.includes(nick.toLowerCase());
    
    return isMod || isBroadcaster || isAdditionalUser;
}

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    
    // Handling chat message
    if (listener === 'message') {
        const {text, nick, tags, channel} = obj.detail.event.data;
        const userstate = {
            'mod': parseInt(tags.mod),
            'sub': parseInt(tags.subscriber),
            'vip': (tags.badges.indexOf("vip") !== -1),
            'badges': {
                'broadcaster': (nick === channel),
            }
        };

        // Check for VS command
        if (text.startsWith(fieldData.vsCommand || '!vs')) {
            if (!hasPermission(userstate, nick, channel)) {
                console.log("No permissions")
                return; // User doesn't have permission
            }

            const result = parseVsCommand(text);
            if (result.success) {
                if (result.type === 'reset') {
                    battleState.reset();
                    console.log(`Battle reset by ${nick}`);
                } else if (result.type === 'end') {
                    if (battleState.state === 'round_A' || battleState.state === 'round_B') {
                        battleState.endBattle();
                        console.log(`Battle ended early by ${nick}`);
                    } else {
                        console.log(`Battle end command by ${nick}: No active battle to end`);
                    }
                } else if (result.type === 'start') {
                    const battleStarted = battleState.startBattle(result.optionA, result.optionB, result.seconds);
                    if (!battleStarted) {
                        console.log(`Battle start blocked by ${nick}: Battle already in progress`);
                        // Could send message back to chat here if needed
                    }
                }
            }
            return;
        }
    }
    
    // Handle widget buttons
    if (obj.detail.event) {
        if (obj.detail.event.listener === 'widget-button') {
            if (obj.detail.event.field === 'demoBattle') {
                startDemoBattle();
            }
            return;
        }
    } 
    
    // Handle other events for points
    if (listener.indexOf("-latest") === -1) return;
    handleEvent(listener, obj.detail.event);
});

// Demo button functionality
function startDemoBattle() {
    const battleStarted = battleState.startBattle("Pineapple on pizza", "Ketchup on pizza", 30);
    if (!battleStarted) {
        console.log("Demo battle blocked: Battle already in progress");
        // Could show a message to the user here if needed
    }
}

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    fieldData.additionalUsers = fieldData.additionalUsers.toLowerCase().split(',').map(el => el.trim());
    
    // Check if we're in editor mode
    SE_API.getOverlayStatus().then(status => {
        isEditorMode = status.isEditorMode;
        battleState.updateVisibility();
    }).catch(() => {
        // Fallback if API is not available
        isEditorMode = false;
        battleState.updateVisibility();
    });
    
    battleState.loadState();
});