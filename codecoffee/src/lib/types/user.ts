//  id         | text                           |           | not null |
//  email      | text                           |           | not null |
//  username   | text                           |           | not null |
//  password   | text                           |           |          |
//  firstName  | text                           |           | not null |
//  lastName   | text                           |           | not null |
//  avatar     | text                           |           |          |
//  bio        | text                           |           |          |
//  rating     | integer                        |           | not null | 0
//  points     | integer                        |           | not null | 0
//  streak     | integer                        |           | not null | 0
//  lastSolved | timestamp(3) without time zone |           |          |
//  isVerified | boolean                        |           | not null | false
//  provider   | "AuthProvider"                 |           | not null | 'LOCAL'::"AuthProvider"
//  providerId | text                           |           |          |
//  createdAt  | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP
//  updatedAt  | timestamp(3) without time zone |           | not null |

export type User ={
    id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    rating: number;
    points: number;
    streak: number;
    lastSolved?: Date;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}