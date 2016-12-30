import game, { defaultState } from '../../src/reducers/root'

describe('Reducer', function () {
  it('Draws a card', function () {
    const state = {
      drawPile: ['AS', 'KS'],
      discardPile: [],
      winner: false,
      scores: {
        0: 2,
        1: 1,
      }
    }
    const action = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: '10S',
        guess: 0
      }
    }
    expect(game(state, action)).to.deep.equal({
      drawPile: ['AS', 'KS', '10S'],
      discardPile: [],
      winner: false,
      scores: {
        0: 2,
        1: 1,
      }
    })
  });

  it('Guesses high', function () {
    const state = {
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: ['AS', '10D'],
      discardPile: ['KD'],
      scores: {
        0: 3,
        1: 7,
      },
      winner: false
    }
    // Correct guess
    const correctGuess = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: 'JD',
        guess: 1
      }
    }
    const correctResult = game(state, correctGuess)
    expect(correctResult).to.deep.equal({
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: ['AS', '10D', 'JD'],
      discardPile: ['KD'],
      scores: {
        0: 3,
        1: 7,
      },
      winner: false
    })
    // Incorrect guess
    const incorrectGuess = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: '3D',
        guess: 1
      }
    }
    const incorrectResult = game(state, incorrectGuess)
    expect(incorrectResult).to.deep.equal({
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: [],
      discardPile: ['KD', 'AS', '10D', '3D'],
      scores: {
        0: 3,
        1: 10,
      },
      winner: false
    })
  });

  it('Guesses low', function () {
    const state = {
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: ['AS', '10D'],
      discardPile: ['KD'],
      scores: {
        0: 3,
        1: 7,
      },
      winner: false
    }
    // Correct guess
    const correctGuess = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: '3D',
        guess: -1
      }
    }
    const correctResult = game(state, correctGuess)
    expect(correctResult).to.deep.equal({
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: ['AS', '10D', '3D'],
      discardPile: ['KD'],
      scores: {
        0: 3,
        1: 7,
      },
      winner: false
    })
    // Incorrect guess
    const incorrectGuess = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: 'JD',
        guess: -1
      }
    }
    const incorrectResult = game(state, incorrectGuess)
    expect(incorrectResult).to.deep.equal({
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: [],
      discardPile: ['KD', 'AS', '10D', 'JD'],
      scores: {
        0: 3,
        1: 10,
      },
      winner: false
    })
  });

  it('Ends the game when no cards left', function () {
    const state = {
      drawPile: ['AS', 'KS'],
      discardPile: Array.from({length: 49}).fill('foo'),
      scores: {
        0: 3,
        1: 2
      },
      winner: false
    }

    const action = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: '10S',
        guess: 0
      }
    }
    expect(game(state, action)).to.deep.equal({
      drawPile: ['AS', 'KS', '10S'],
      discardPile: Array.from({length: 49}).fill('foo'),
      scores: {
        0: 3,
        1: 2
      },
      winner: 0
    })
  });

  it('Ends the game when one player has 27', function () {
    const state = {
      drawPile: ['AS', 'KS'],
      discardPile: [],
      scores: {
        0: 24,
        1: 2
      },
      playingId: 0,
      winner: false
    }

    const action = {
      type: 'DRAW_CARD_FULFILLED',
      payload: {
        card: '10S',
        guess: 1
      }
    }
    expect(game(state, action)).to.deep.equal({
      drawPile: [],
      discardPile: ['AS', 'KS', '10S'],
      playingId: 0,
      scores: {
        0: 27,
        1: 2
      },
      winner: 1
    })
  });

  it('Swaps players', function () {
    const state = {
      playingId: 0
    }
    const action = {
      type: 'SWAP_PLAYERS'
    }
    const result1 = game(state, action)
    const result2 = game(result1, action)
    expect(result1.playingId).to.equal(1)
    expect(result2).to.deep.equal(state)
  });

  it('Resets the game', function () {
    const state = {
      deckId: 'lksjssjl',
      playingId: 1,
      drawPile: ['AS'],
      discardPile: ['KD'],
      scores: {
        0: 3,
        1: 7,
      },
    }
    const action = {
      type: 'RESET_FULFILLED',
      payload: 'foo'
    }
    const expectedState = Object.assign({}, defaultState)
    expectedState.deckId = 'foo'
    expect(game(state, action)).to.deep.equal(expectedState)
  });

  it('Deals with unexpected events', function () {
    const state = 'foo'
    const action = {
      type: 'Blarg'
    }
    expect(game(state, action)).to.equal(state)
  });
});
