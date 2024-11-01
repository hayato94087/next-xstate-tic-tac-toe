import { TicTacToe } from "@/components/tic-tac-toe";
import { type FC } from "react";

const Home: FC = () => {
  return (
    <main>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <TicTacToe />
        </div>
      </div>
    </main>
  );
};

export default Home;