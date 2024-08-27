"use client";

import { useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  DialogProps,
  DialogClose,
  DialogCloseButton,
  DialogHeader,
  DialogDescription,
} from "@mui/material";

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    // We'll implement the API call here
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      console.log("Starting saveFlashcards");
      const userDocRef = doc(collection(db, "users"), user.id);
      console.log("userDocRef:", userDocRef);
      const userDocSnap = await getDoc(userDocRef);
      console.log("userDocSnap:", userDocSnap);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("userData:", userData);
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        console.log("updatedSets:", updatedSets);
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        console.log("No user doc exists, creating one");
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      // const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      // console.log("setDocRef:", setDocRef);
      // batch.set(setDocRef, { flashcards });

      await batch.commit();

      console.log("Finished saveFlashcards");
      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };
  return (
    <Container maxWidth="md" sx={{ bgcolor: "#f5f5f5", p: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>

      {/* We'll add flashcard display here */}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Front:</Typography>
                    <Typography>{flashcard.front}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Back:
                    </Typography>
                    <Typography>{flashcard.back}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {flashcards.length > 0 && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
              >
                Save Flashcards
              </Button>
            </Box>
          )}
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
