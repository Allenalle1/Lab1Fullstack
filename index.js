const PORT = 3001 || process.env.PORT
const express = require ("express")
const connection= require("./connection")
const app = express()
const path = require("path")

require("dotenv").config()

connection()
app.use(express.static("public"))
app.use(express.json())

const Recipe = require('./models/recipe');

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/recipes', async (req, res) => {
    try {
      const newRecipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cookingTime: req.body.cookingTime
      });
  
      const savedRecipe = await newRecipe.save();
  
      res.status(201).json(savedRecipe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
// Delete a recipe by title
app.delete('/recipes/:title', async (req, res) => {
    const recipeTitle = req.params.title;

    try {
        const deletedRecipe = await Recipe.findOneAndDelete({ title: recipeTitle });

        if (!deletedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/', async(req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/form.html', async(req, res) => {
    res.sendFile(path.join(__dirname, '/form.html'));
  });

  app.get('/index.html', async(req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

  app.get('/putform.html', async(req, res) => {
    res.sendFile(path.join(__dirname, '/putform.html'));
  });

  app.get('/options', async (req, res) => {
    try {
        const options = await Recipe.find();


        res.json(options);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/recipes/:option', async (req, res) => {
    const selectedOption = req.params.option;
    try {
        const recipe = await Recipe.find({ title: selectedOption });
        res.json(recipe);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.put('/recipes/:title', async (req, res) => {
        const title = req.params.title;
    
        try {
            const recipe = await Recipe.findOne({ title });
    
            if (!recipe) {
                return res.status(404).json({ message: "Recipe not found" });
            }
    
            // Update the recipe details
            recipe.title = req.body.title;
            recipe.ingredients = req.body.ingredients;
            recipe.instructions = req.body.instructions;
            recipe.cookingTime = req.body.cookingTime;
    
            const updatedRecipe = await recipe.save();
    
            res.json(updatedRecipe); // Return the updated recipe 
        } catch (err) {
            console.error('Error updating recipe:', err);
            res.status(500).json({ message: err.message });
        }
    });

    app.get('/modify/:title', async (req, res) => {
        const selectedTitle = req.params.title;
        console.log('Selected Title:', selectedTitle); // debugging
        try {
            const recipe = await Recipe.findOne({ title: selectedTitle });
            
            if (!recipe) {
                return res.status(404).json({ message: "Recipe not found" });
            }
    
            console.log('Fetched Recipe:', recipe); // debugging
            res.json(recipe); 
        } catch (err) {
            console.error('Error fetching recipe details:', err);
            res.status(500).json({ message: err.message });
        }
    });

app.listen(PORT)
console.log("Listening to the port "+ PORT)