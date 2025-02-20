'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TennisSimulator() {
  const [player1, setPlayer1] = useState("");
  const [level1, setLevel1] = useState(5);
  const [player2, setPlayer2] = useState("");
  const [level2, setLevel2] = useState(5);
  const [points, setPoints] = useState([]);
  const [score, setScore] = useState(null);
  const [isGeneratingPoints, setIsGeneratingPoints] = useState(false); 

  useEffect(() => {
    if (isGeneratingPoints) {
      const newPoints = [];
      for (let i = 0; i < 150; i++) {
        const winner = Math.random() < level1 / (level1 + level2) ? player1 : player2;
        newPoints.push(`Point ${i + 1}: remporté par ${winner}`);
      }
      setPoints(newPoints);
      setIsGeneratingPoints(false);
    }
  }, [isGeneratingPoints, level1, level2, player1, player2]);

  const formatGameScore = () => {
    if (!score || !score.currentGameStatus) return "0 - 0";
    return score.currentGameStatus;
};

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const sendToBackend = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/calculate-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player1, player2, points }),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();

        setScore(result);
    } catch (error) {
        console.error("Erreur lors de la récupération du score:", error);
    }
};

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card className="p-4">
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nom Joueur 1" value={player1} onChange={(e) => setPlayer1(e.target.value)} className="border p-2" />
            <input type="number" min="1" max="10" value={level1} onChange={(e) => setLevel1(parseInt(e.target.value))} className="border p-2" />
            <input type="text" placeholder="Nom Joueur 2" value={player2} onChange={(e) => setPlayer2(e.target.value)} className="border p-2" />
            <input type="number" min="1" max="10" value={level2} onChange={(e) => setLevel2(parseInt(e.target.value))} className="border p-2" />
          </div>
          <Button onClick={() => setIsGeneratingPoints(true)} className="mt-4 cursor-pointer">Générer 150 points</Button>
          <Button onClick={sendToBackend} className="mt-4 ml-2 cursor-pointer">Calculer le Score</Button>
          <div className="mt-4 max-h-64 overflow-y-scroll">
            {points.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {score && (
            <div className="mt-4 p-4 border">
              <p><strong>Résultat :</strong> {score.winner ? `Vainqueur: ${score.winner}` : "Jeu en cours, pas de vainqueur"}</p>
              <table className="w-full border">
                <thead>
                  <tr>
                    <th> </th>
                    <th>Set 1</th>
                    <th>Set 2</th>
                    <th>Set 3</th>
                    <th>Current Game</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td>{player1}</td>
                    <td>{score.sets[0][0]}</td>
                    <td>{score.sets[1][0]}</td>
                    <td>{score.sets[2][0]}</td>
                    <td>{formatGameScore()[0]}</td>
                  </tr>
                  <tr className="text-center">
                    <td>{player2}</td>
                    <td>{score.sets[0][1]}</td>
                    <td>{score.sets[1][1]}</td>
                    <td>{score.sets[2][1]}</td>
                    <td>{formatGameScore()[1]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
