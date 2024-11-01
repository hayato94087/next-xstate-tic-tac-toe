import { EventObject, assign, setup } from 'xstate';

/* eslint-plugin-xstate-include */

function assertEvent<TEvent extends EventObject, Type extends TEvent['type']>(
  ev: TEvent,
  type: Type
): asserts ev is Extract<TEvent, { type: Type }> {
  if (ev.type !== type) {
    throw new Error('Unexpected event type.');
  }
}

type Player = 'x' | 'o';

const context = {
  board: Array(9).fill(null) as Array<Player | null>,
  moves: 0,
  player: 'x' as Player,
  winner: undefined as Player | undefined
};

type TicTacToeEvent = { type: 'PLAY'; value: number } | { type: 'RESET' };

export const ticTacToeMachine = setup({
  types: {} as {
    context: typeof context;
    events: TicTacToeEvent;
  },
  actions: {
    updateBoard: assign({
      board: ({ context, event }) => {
        assertEvent(event, 'PLAY');
        const updatedBoard = [...context.board];
        updatedBoard[event.value] = context.player;
        return updatedBoard;
      },
      moves: ({ context }) => context.moves + 1,
      player: ({ context }) => (context.player === 'x' ? 'o' : 'x')
    }),
    resetGame: assign(context),
    setWinner: assign({
      winner: ({ context }) => (context.player === 'x' ? 'o' : 'x')
    })
  },
  guards: {
    checkWin: ({ context }) => {
      const { board } = context;
      const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

      for (const line of winningLines) {
        const xWon = line.every((index) => {
          return board[index] === 'x';
        });

        if (xWon) {
          return true;
        }

        const oWon = line.every((index) => {
          return board[index] === 'o';
        });

        if (oWon) {
          return true;
        }
      }

      return false;
    },
    checkDraw: ({ context }) => {
      return context.moves === 9;
    },
    isValidMove: ({ context, event }) => {
      if (event.type !== 'PLAY') {
        return false;
      }

      return context.board[event.value] === null;
    }
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbdATwKgGIAFAGQEEBNAbQAYBdRUGQD2sXABdcQ-AJAAPRAFoAjAA4AnCQAsagGwBmJdwCsaldwBMe82oA0Iaor0kTOpfu5q13bUqMBfPzs0LDxCUkoaOnoefiQQYVEJKRl5BBUdEiUAdizudPNDMyUlczsHBBKScyMTa1U9bkadHQCgjBwCYnIqWnwGTiVYwRFxSWk41JUlTO4dC01zbjdzHU1NMsQ1TRIso1cF8010o3U9VpBgjrCSKHRUMAB5ADcwACd6ACUAUQBlL4AVGIyBKjZITRBKPQaaxqcwqHKrTRGYwbBAKAoZNRGbJ6NYlVRwzQBQIgfBCCBwGSXULEYEjJLjUCpdF6LJaXQGYymCxWWz2RzeKpZTSrLJqQw6NRZQ7namdcI9Oh0xJjFKIFTObgGLJmPKaLIlYWohReZzipEGw5GfVKNSy9o00i3e7PN7K0GMuSIPS49nYzQ+lQNQ5ZY22jVa7z6GrVYVZe0heU3O6PF6vEgAdwIhFe7oZaoQehU5j9SgDReD+rDhh23F2Is8zR9qgTVy6ztTbxIEFe6AzedV4IQeJIUKyRfMux10pqqJKRhIWsM+vLRSMZ2JQA */
  initial: 'playing',
  context,
  states: {
    playing: {
      always: [
        { target: 'gameOver.winner', guard: 'checkWin' },
        { target: 'gameOver.draw', guard: 'checkDraw' }
      ],
      on: {
        PLAY: [
          {
            target: 'playing',
            guard: 'isValidMove',
            actions: 'updateBoard'
          }
        ]
      }
    },
    gameOver: {
      initial: 'winner',
      states: {
        winner: {
          tags: 'winner',
          entry: 'setWinner'
        },
        draw: {
          tags: 'draw'
        }
      },
      on: {
        RESET: {
          target: 'playing',
          actions: 'resetGame'
        }
      }
    }
  }
});