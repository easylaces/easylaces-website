import { NextResponse } from "next/server";

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url: string;
  relative_time_description: string;
}

interface GooglePlaceDetails {
  result: {
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
}

export interface ReviewData {
  name: string;
  rating: number;
  text: string;
  time: number;
  photoUrl: string;
  relativeTime: string;
}

export interface ReviewsResponse {
  reviews: ReviewData[];
  overallRating: number;
  totalReviews: number;
  source: "google" | "static";
}

// Cache reviews for 1 hour to avoid hitting API limits
let cachedData: ReviewsResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // If no Place ID configured, return static reviews
  if (!placeId || !apiKey) {
    return NextResponse.json({
      reviews: [],
      overallRating: 0,
      totalReviews: 0,
      source: "static",
    } satisfies ReviewsResponse);
  }

  // Return cached data if still fresh
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data: GooglePlaceDetails = await res.json();

    if (data.status !== "OK" || !data.result.reviews) {
      return NextResponse.json({
        reviews: [],
        overallRating: 0,
        totalReviews: 0,
        source: "static",
      } satisfies ReviewsResponse);
    }

    const response: ReviewsResponse = {
      reviews: data.result.reviews.map((r) => ({
        name: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.time,
        photoUrl: r.profile_photo_url,
        relativeTime: r.relative_time_description,
      })),
      overallRating: data.result.rating || 0,
      totalReviews: data.result.user_ratings_total || 0,
      source: "google",
    };

    // Update cache
    cachedData = response;
    cacheTimestamp = Date.now();

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return NextResponse.json({
      reviews: [],
      overallRating: 0,
      totalReviews: 0,
      source: "static",
    } satisfies ReviewsResponse);
  }
}
