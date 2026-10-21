from datetime import date
import math
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from . import data
from psycopg2.extras import RealDictCursor
from ..db_operations.db_connect import get_connection_obj

# lost
names_vectorizor_lost = TfidfVectorizer()
descriptions_vectorizor_lost = TfidfVectorizer()
locations_vectorizor_lost = TfidfVectorizer()

tfidf_matrix_names_lost = None
tfidf_matrix_descriptions_lost = None
tfidf_matrix_locations_lost = None

# found
names_vectorizor_found = TfidfVectorizer()
descriptions_vectorizor_found = TfidfVectorizer()
locations_vectorizor_found = TfidfVectorizer()

tfidf_matrix_names_found = None
tfidf_matrix_descriptions_found = None
tfidf_matrix_locations_found = None


def get_days_difference(searched_date: str, dates: list[str]):
    score = []
    lambda_val = 0.1
    searched_date = date.fromisoformat(searched_date)
    for d in dates:
        d = date.fromisoformat(d)
        abs_diff = abs((searched_date - d).days)
        normalised_val = math.exp(-lambda_val * abs_diff)
        score.append(normalised_val)
    return score


def vectorize_found(data):
    if not data["found_items_data"]:
        return

    # found
    names, descriptions, locations, dates = map(list, zip(*data["found_items_data"]))
    global tfidf_matrix_names_found, tfidf_matrix_descriptions_found, tfidf_matrix_locations_found

    tfidf_matrix_names_found = names_vectorizor_found.fit_transform(names)
    tfidf_matrix_descriptions_found = descriptions_vectorizor_found.fit_transform(
        descriptions
    )
    tfidf_matrix_locations_found = locations_vectorizor_found.fit_transform(locations)


def vectorize_lost(data):
    if not data["lost_items_data"]:
        return

    # lost
    names, descriptions, locations, dates = map(list, zip(*data["lost_items_data"]))
    global tfidf_matrix_names_lost, tfidf_matrix_descriptions_lost, tfidf_matrix_locations_lost

    tfidf_matrix_names_lost = names_vectorizor_lost.fit_transform(names)
    tfidf_matrix_descriptions_lost = descriptions_vectorizor_lost.fit_transform(
        descriptions
    )
    tfidf_matrix_locations_lost = locations_vectorizor_lost.fit_transform(locations)


def calculate_similarity_lost(data, query):
    similarity_scores = []
    name_query, description_query, location_query, date_query = query
    date_arr = [l[3] for l in data["lost_items_data"]]

    name_vector = names_vectorizor_lost.transform([name_query])
    description_vector = descriptions_vectorizor_lost.transform([description_query])
    location_vector = locations_vectorizor_lost.transform([location_query])

    name_scores = cosine_similarity(name_vector, tfidf_matrix_names_lost).ravel()
    description_scores = cosine_similarity(
        description_vector, tfidf_matrix_descriptions_lost
    ).ravel()
    location_scores = cosine_similarity(
        location_vector, tfidf_matrix_locations_lost
    ).ravel()
    date_scores = get_days_difference(date_query, [str(d) for d in date_arr])

    for score in zip(description_scores, name_scores, location_scores, date_scores):
        similarity_scores.append(
            (0.45 * score[0])
            + (0.35 * score[1])
            + (0.10 * score[2])
            + (0.10 * score[3])
        )

    merged_result = [
        d[0] + [d[1]] for d in zip(data["lost_items_data"], similarity_scores)
    ]
    merged_result.sort(key=lambda x: x[4], reverse=True)

    result = list(filter(lambda x: x[4] > 0.15, merged_result))
    result = [
        {
            "Item_Name": d[0],
            "Description": d[1],
            "Location_Lost": d[2],
            "Date_found": d[3],
        }
        for d in result
    ]
    return result


def calculate_similarity_found(data, query):
    similarity_scores = []
    name_query, description_query, location_query, date_query = query
    date_arr = [l[3] for l in data["found_items_data"]]

    name_vector = names_vectorizor_found.transform([name_query])
    description_vector = descriptions_vectorizor_found.transform([description_query])
    location_vector = locations_vectorizor_found.transform([location_query])

    name_scores = cosine_similarity(name_vector, tfidf_matrix_names_found).ravel()

    description_scores = cosine_similarity(
        description_vector, tfidf_matrix_descriptions_found
    ).ravel()

    location_scores = cosine_similarity(
        location_vector, tfidf_matrix_locations_found
    ).ravel()

    date_scores = get_days_difference(date_query, [str(d) for d in date_arr])

    for score in zip(description_scores, name_scores, location_scores, date_scores):
        similarity_scores.append(
            (0.45 * score[0])
            + (0.35 * score[1])
            + (0.10 * score[2])
            + (0.10 * score[3])
        )

    merged_result = [
        d[0] + [d[1]] for d in zip(data["found_items_data"], similarity_scores)
    ]
    merged_result.sort(key=lambda x: x[4], reverse=True)

    result = list(filter(lambda x: x[4] > 0.15, merged_result))
    result = [
        {
            "Item_Name": d[0],
            "Description": d[1],
            "Location_Lost": d[2],
            "Date_Lost": d[3],
        }
        for d in result
    ]
    return result


def retrieve_items():
    conn = None
    cur = None

    try:
        conn = get_connection_obj()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT "Item_Name", "Description", "Location_Lost", "Date_Lost"
            FROM "Loser"
        """)
        lost_items = cur.fetchall()

        data.data["lost_items_data"] = [
            [
                row["Item_Name"],
                row["Description"],
                row["Location_Lost"],
                row["Date_Lost"]
            ]
            for row in lost_items
        ]

        cur.execute("""
            SELECT "Item_Name", "Description", "Location_Lost", "Date_Found"
            FROM "Finder"
        """)
        found_items = cur.fetchall()

        data.data["found_items_data"] = [
            [
                row["Item_Name"],
                row["Description"],
                row["Location_Lost"],
                row["Date_Found"]
            ]
            for row in found_items
        ]


    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()