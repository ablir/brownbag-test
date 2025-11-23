import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface LoginRequest {
  username: string;
  password: string;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  company: string;
  jobTitle: string;
  bio: string;
  joinedDate: string;
  lastLogin: string;
}

// Generate fake user data
const generateUserInfo = (username: string): UserInfo => {
  return {
    id: faker.string.uuid(),
    username,
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    bio: faker.person.bio(),
    joinedDate: faker.date.past({ years: 2 }).toISOString(),
    lastLogin: new Date().toISOString(),
  };
};

// Routes
app.post('/api/login', (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { username, password } = req.body;

  // For now, accept any credentials
  if (username && password) {
    const token = faker.string.alphanumeric(32);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      username,
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }
});

app.get('/api/user/info', (req: Request, res: Response) => {
  // Get username from query or use a default
  const username = (req.query.username as string) || 'user';

  const userInfo = generateUserInfo(username);
  res.json(userInfo);
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
