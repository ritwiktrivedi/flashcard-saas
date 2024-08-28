"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import { CardActionArea } from "@mui/material";
import { usePathname } from "next/navigation";
import "../../flashcards.css"; // Ensure this file is imported

export default function Flashcard() {
  const pathname = usePathname();
  const setName = pathname.split("/")[2]; // 'Python' or 'MLv2'
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function getFlashcards() {
      if (!isLoaded || !isSignedIn) return;
      try {
        const docRef = doc(db, `users/${user.id}/flashcardSets/${setName}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFlashcards(docSnap.data().flashcards || []);
        } else {
          await setDoc(docRef, { flashcards: [] }); // Create empty flashcards array if it doesn't exist
        }
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      } finally {
        setLoading(false); // Set loading to false after the data fetch
      }
    }
    getFlashcards();
  }, [user, isLoaded, isSignedIn, setName]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ alignContent: "center" }}>
      <Typography variant="h4" sx={{ mt: 4 }}>
        {setName} Flashcards
      </Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <div
              className={`card ${flipped[flashcard.id] ? "flipped" : ""}`}
              onClick={() => handleCardClick(flashcard.id)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.front}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
                <div className="card-back">
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.back}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
