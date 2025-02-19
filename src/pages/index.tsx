import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { GameState, useTTTStore } from "../datamodel/zustand";
import { FieldState, TTTBoard } from "../datamodel/gamestate";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  const { board, claimField, clearBoard } = useTTTStore((state) => state);

  return (
    <>
      <Head>
        <title>Create T3TTT App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Create <span className="text-purple-300">T3TTT</span> App
        </h1>
        <Board board={board} claimField={claimField} clearBoard={clearBoard} />
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          <Label board={board} />
        </h1>
        {board.isOver() && (
          <button
            className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
            onClick={clearBoard}
          >
            {"Restart?"}
          </button>
        )}
      </main>
    </>
  );
};

export default Home;

const Label = ({ board }: { board: TTTBoard }) => {
  if (!board.isOver()) {
    return (
      <span>
        Turn: <span className="text-purple-300">{board.turn.toString()}</span>
      </span>
    );
  } else {
    if (board.getWinner() === " ") {
      return <span className="text-purple-300">{"It's a draw!"}</span>;
    } else {
      return (
        <span>
          Winner:{" "}
          <span className="text-purple-300">
            {board.getWinner().toString()}
          </span>
        </span>
      );
    }
  }
};

const Board = ({ board, claimField, clearBoard }: GameState) => {
  return (
    <div className="mt-3 grid grid-cols-3 gap-3 pt-3 text-center">
      {board.fields.map((row, i) =>
        row.map((field, j) => (
          <FieldCard
            key={`${i}, ${j}, ${field.state}`}
            fieldState={field.state}
            i={i}
            j={j}
            claimField={(i: number, j: number) => {
              if (!board.isOver() && board.getField(i, j).state === " ") {
                claimField(i, j, board.turn);
              }
            }}
          />
        ))
      )}
    </div>
  );
};

type FieldCardProps = {
  fieldState: FieldState;
  i: number;
  j: number;
  claimField: (i: number, j: number) => void;
};

const FieldCard = ({ fieldState, i, j, claimField }: FieldCardProps) => {
  return (
    <section
      className="flex h-28 w-28 cursor-pointer select-none flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105"
      onClick={() => {
        claimField(i, j);
      }}
    >
      <h2 className="text-5xl text-gray-700">{fieldState.toString()}</h2>
    </section>
  );
};
