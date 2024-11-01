'use client'

import { useMachine } from '@xstate/react'
import { ticTacToeMachine } from '@/machines/tic-tac-toe-machine'
import { X, Circle } from 'lucide-react'

export const TicTacToe = () => {
  const [state, send] = useMachine(ticTacToeMachine)
  const { board, player, winner } = state.context

  const handleCellClick = (index: number) => {
    send({ type: 'PLAY', value: index })
  }

  const resetGame = () => {
    send({ type: 'RESET' })
  }

  const renderCell = (value: string | null, index: number) => {
    return (
      <button
        key={index}
        className="w-24 h-24 flex items-center justify-center text-4xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => handleCellClick(index)}
        disabled={!!value || state.hasTag('winner') || state.hasTag('draw')}
      >
        {value === 'x' && <X className="w-16 h-16 text-blue-600" />}
        {value === 'o' && <Circle className="w-16 h-16 text-red-600" />}
      </button>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="w-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">○×ゲーム</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {board.map((cell, index) => renderCell(cell, index))}
        </div>
        <div className="text-center">
          {state.hasTag('winner') && (
            <p className="text-2xl font-bold mb-6 animate-pulse" style={{ color: winner === 'x' ? '#2563EB' : '#DC2626' }}>
              プレイヤー {winner === 'x' ? '✗' : '○'} の勝利です！
            </p>
          )}
          {state.hasTag('draw') && (
            <p className="text-2xl font-bold mb-6 text-gray-600 animate-pulse">引き分けです！</p>
          )}
          {!state.hasTag('winner') && !state.hasTag('draw') && (
            <p className="text-2xl font-semibold mb-6 text-gray-700">
              現在のプレイヤー: <span style={{ color: player === 'x' ? '#2563EB' : '#DC2626' }}>{player === 'x' ? '✗' : '○'}</span>
            </p>
          )}
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white font-bold rounded-full hover:from-blue-600 hover:to-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ゲームをリセット
          </button>
        </div>
      </div>
    </div>
  )
}