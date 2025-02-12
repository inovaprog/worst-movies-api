# Worst Movies API
## API Requirements:
Read the CSV file of movies and insert the data into a database when the application starts.
Retrieve the producer with the largest gap between two consecutive awards, and the one who achieved two awards the fastest.
## Application Execution Requirements
- NodeJS v20.15
## Installation
```bash
npm install
```
## How to Run:
Replace the file `data/movielist.csv` with the movie data following the current format.
To run in development mode:
```
npm run start:dev
```

## Endpoints
### Movies
#### 1. List All Movies
**GET** `/movies`
Returns a list of all movies.
**Example Response**:
```json
[
  {
    "id": 3,
    "title": "Morbius",
    "year": 2022,
    "studios": "Columbia Pictures",
    "winner": false,
    "producers": ["Avi Arad", "Matt Tolmach"]
  },
  {
    "id": 2,
    "title": "The Emoji Movie",
    "year": 2017,
    "studios": "Sony Pictures Animation",
    "winner": false,
    "producers": ["Michelle Raimo Kouyate"]
  }
]
```
### Search for a Movie by ID
#### **GET** `/movies/:id`
This endpoint returns the details of a specific movie based on the provided `id`.
**Parameters**:
- `id` (path): The ID of the movie you want to search for (must be an integer).
**Example Request**:
```
GET /movies/1
```
**Example Success Response (200 OK)**:
```json
{
  "id": 1,
  "title": "Cats",
  "year": 2019,
  "studios": "Universal Pictures",
  "winner": false,
  "producers": ["Tom Hooper", "Debra Hayward"]
}
```
Response Codes:
 ```200 OK```: Returns the movie details.
 ```404 Not Found```: The movie was not found.
 ```400 Bad Request```: The provided id is invalid (not an integer).

### Insert a New Movie
#### **POST** `/movies`
This endpoint allows inserting a new movie into the database.
**Parameters**:
The request body must contain the following fields:
- `title` (string, required): The title of the movie.
- `year` (number, required): The release year of the movie.
- `studios` (string, required): The studio that made the movie.
- `winner` (boolean, required): Indicates if the movie was a winner.
- `producers` (array of strings, required): A list of the names of the producers of the movie.
**Example Request**:
```json
POST /movies
{
  "title": "Movie Example",
  "year": 2021,
  "studios": "Studio Example",
  "winner": true,
  "producers": ["Producer 1", "Producer 2"]
}
```
Response Codes:
 ```200 OK```: Returns the movie details.
 ```500 Internal Server Error```: Unexpected system error.
 ```400 Bad Request```: Some fields are invalid.

### Update a Movie
#### **PUT** `/movies/:id`
This endpoint allows updating the information of an existing movie in the database, identified by its `id`.
**Parameters**:
- `id` (number, required): The ID of the movie to be updated. This parameter must be passed in the URL.
The request body can contain the following fields:
- `title` (string, optional): The new title of the movie.
- `year` (number, optional): The new release year of the movie.
- `studios` (string, optional): The studio that made the movie.
- `winner` (boolean, optional): Indicates if the movie was a winner.
- `producers` (array of strings, optional): A list of new producers of the movie.
**Example Request**:
```json
PUT /movies/1
{
  "title": "Updated Movie Example",
  "year": 2022,
  "winner": false,
  "producers": ["Producer 3"]
}
```
### Delete a Movie
#### **DELETE** `/movies/:id`
This endpoint allows deleting an existing movie in the database, identified by its `id`.
**Parameters**:
- `id` (number, required): The ID of the movie to be deleted. This parameter must be passed in the URL.
**Example Request**:
```http
DELETE /movies/1
```
Response Codes:
 ```200 OK```: Movie successfully deleted.
 ```500 Internal Server Error```: Unexpected system error.
 ```400 Bad Request```: The ID field is invalid.
 ### Get Intervals of Winning Producers
#### **GET** `/movies/winners/intervals`
This endpoint returns the producers who won more than once, showing the minimum and maximum intervals between wins.
**Response**:
The response contains two arrays: `min` and `max`. The `min` array contains the producers with the smallest intervals between wins, while the `max` array contains the producers with the largest intervals between wins.
**Example Request**:
```http
GET /movies/winners/intervals
```
**Example Response**
```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    },
    {
      "producer": "Producer 2",
      "interval": 1,
      "previousWin": 2018,
      "followingWin": 2019
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    },
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 2000,
      "followingWin": 2099
    }
  ]
}
```
### Integration Tests
Integration tests are available in `/tests/`
There is a dedicated CSV file for testing that creates an end-to-end integration.
#### Running the Integration Tests:
```
npm run test
```
