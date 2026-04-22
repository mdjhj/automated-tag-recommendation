![License](https://img.shields.io/badge/license-MIT-blue)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)


# Stack Overflow Tag Prediction Research + Website

This repository combines two related parts of the same project:

1. a cleaned research notebook for Stack Overflow tag prediction, and
2. a MERN website that uses the research output in the backend.

## Repository layout

```text
.
├── notebooks/
│   ├── stackoverflow_tag_prediction_.ipynb
│   └── stackoverflow_tag_prediction_with_sampling.ipynb
├── backend/
├── frontend/
├── data/
│   ├── raw/
│   └── processed/
└── README.md
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
2. Open `notebooks/stackoverflow_tag_prediction_.ipynb` for the polished main pipeline.
3. Open `notebooks/stackoverflow_tag_prediction_with_sampling.ipynb` for the appendix with MLkNN, MLSMOTE, and MLSOL.
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

Store them in a folder such as `backend/models/`.

Then add a backend endpoint similar to this idea:

```js
POST /api/tag-prediction
```

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

# License

This project is licensed under the **MIT License**.
