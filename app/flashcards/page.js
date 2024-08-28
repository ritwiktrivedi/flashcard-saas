"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "../../firebase.js";
import { collection, doc, getDoc } from "firebase/firestore";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CardActionArea } from "@mui/material";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleCardClick = (setName) => {
    router.push(`/flashcard/${setName}`);
  };

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;
      try {
        const userDocRef = doc(collection(db, "users"), user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFlashcardSets(userData.flashcardSets || []);
        } else {
          console.log("No user document found!");
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      getFlashcardSets();
    }
  }, [user, isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mt: 4 }}>
          Please sign in to view your flashcard sets.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Your Flashcard Sets
      </Typography>
      {flashcardSets.length === 0 ? (
        <Typography>You haven't created any flashcard sets yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {flashcardSets.map((set, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(set.name)}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {set.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useUser, getToken } from "@clerk/nextjs"; // Import getToken from Clerk
// import { useRouter } from "next/navigation";
// import { db } from "../../firebase.js";
// import { collection, doc, getDoc } from "firebase/firestore";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { CardActionArea } from "@mui/material";

// export default function Flashcard() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [flashcardSets, setFlashcardSets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const handleCardClick = (setName) => {
//     router.push(`/flashcard/${setName}`);
//   };

//   useEffect(() => {
//     async function getFlashcardSets() {
//       if (!user) return;
//       try {
//         const token = await getToken(); // Get the auth token from Clerk

//         if (token) {
//           // Set the token in Firebase auth state
//           await db.auth().signInWithCustomToken(token);
//         }

//         const userDocRef = doc(collection(db, "users"), user.id);
//         const userDocSnap = await getDoc(userDocRef);

//         if (userDocSnap.exists()) {
//           const userData = userDocSnap.data();
//           setFlashcardSets(userData.flashcardSets || []);
//         } else {
//           console.log("No user document found!");
//         }
//       } catch (error) {
//         console.error("Error fetching flashcard sets:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (isLoaded && isSignedIn) {
//       getFlashcardSets();
//     }
//   }, [user, isLoaded, isSignedIn]);

//   if (!isLoaded || loading) {
//     return (
//       <Container
//         maxWidth="md"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (!isSignedIn) {
//     return (
//       <Container maxWidth="md">
//         <Typography variant="h5" sx={{ mt: 4 }}>
//           Please sign in to view your flashcard sets.
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
//         Your Flashcard Sets
//       </Typography>
//       {flashcardSets.length === 0 ? (
//         <Typography>You haven't created any flashcard sets yet.</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {flashcardSets.map((set, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card>
//                 <CardActionArea onClick={() => handleCardClick(set.name)}>
//                   <CardContent>
//                     <Typography variant="h5" component="div">
//                       {set.name}
//                     </Typography>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// }
