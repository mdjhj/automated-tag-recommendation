# Stack Overflow Tag Prediction Research + Website

This repository combines two related parts of the same project:

1. a cleaned research notebook for Stack Overflow tag prediction, and
2. a MERN website that uses the research output in the backend.

## Repository layout

```text
.
├── notebooks/
│   ├── thesis_tag_prediction_research_clean.ipynb
│   └── thesis_tag_prediction_research_with_sampling.ipynb
├── backend/
├── frontend/
├── data/
│   ├── raw/
│   └── processed/
├── models/
├── README.md
└── .gitignore
```

## What is inside

The notebooks contain:
- dataset loading and merging,
- tag distribution analysis,
- text preprocessing,
- multilabel target preparation,
- TF-IDF feature extraction,
- a baseline One-vs-Rest LinearSVC model,
- top-k tag prediction,
- a separate appendix notebook that keeps MLkNN, MLSMOTE, and MLSOL.

The website contains:
- a React frontend,
- an Express/MongoDB backend,
- question posting and question viewing flows,
- an authentication layer,
- a natural place to expose a `/api/tag-prediction` endpoint from the backend.

## How to run the research notebooks

1. Put the raw Stack Overflow files in `data/raw/`.
2. Open `notebooks/thesis_tag_prediction_research_clean.ipynb` for the polished main pipeline.
3. Open `notebooks/thesis_tag_prediction_research_with_sampling.ipynb` for the appendix with MLkNN, MLSMOTE, and MLSOL.
4. Run the cells from top to bottom.
5. Save the processed output in `data/processed/`.

Recommended raw file names:
- `data/raw/Questions.csv.zip`
- `data/raw/Tags.csv.zip`

## How to connect the notebook research to the website

After training the model, save these objects:
- the TF-IDF vectorizer,
- the multilabel binarizer,
- the classifier.

Store them in a folder such as `models/` or `backend/ml_artifacts/`.

Then add a backend endpoint similar to this idea:

```js
POST /api/tag-prediction
```

Keep the notebook and website code in the same GitHub repository, but keep the responsibilities separated:
- `notebooks/` for research and experiments,
- `backend/` for API and model serving,
- `frontend/` for the React UI,
- `models/` or `backend/ml_artifacts/` for serialized artifacts.

Request body:
```json
{
  "title": "How do I use pandas merge?",
  "body": "<p>I have two dataframes...</p>"
}
```

Response:
```json
{
  "predicted_tags": ["python", "pandas", "dataframe"]
}
```

The frontend can call this endpoint from the `AddQuestion` page and show suggested tags before submission.

## Important cleanup before publishing

Use environment variables instead of hardcoded secrets.

Recommended backend variables:
- `PORT`
- `MONGODB_URI`
- `MODEL_PATH`

Recommended frontend variables:
- `REACT_APP_API_BASE_URL`

Also remove:
- credentials from `backend/db.js`,
- notebook-only installation cells,
- Colab-specific drive mounting,
- absolute Windows paths.

## Suggested backend fix for MongoDB

Replace any hardcoded connection string with:

```js
const mongoose = require("mongoose");

module.exports.connect = async () => {
  const url = process.env.MONGODB_URI;
  if (!url) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB is connected successfully");
};
```

## Suggested Git workflow

```bash
git init
git add .
git commit -m "Initial commit: clean research notebook and website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Suggested commit structure

A tidy sequence is:
1. `docs: add cleaned research notebook`
2. `chore: add gitignore and env examples`
3. `feat: connect backend tag prediction api`
4. `feat: wire frontend tag suggestions`
5. `docs: add project setup instructions`

## Notes

The original notebook mixed experimentation with the final pipeline. This cleaned version keeps the main story readable and leaves the heavier experiments as research extensions.