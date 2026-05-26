import { connectToDatabase } from "@/config/database.js";
import { env } from "@/config/env.js";
import { UserAccountModel } from "@/models/user-account.model.js";
import { FriendshipModel } from "@/models/friendship.model.js";

async function seed() {
  await connectToDatabase(env.MONGODB_URI);
  console.log("Connected to DB.");

  // Get the first user (likely the one you are logged in as, e.g., varun)
  const mainUser = await UserAccountModel.findOne().sort({ createdAt: 1 });
  if (!mainUser) {
    console.log("No users found in the database to link friends to.");
    process.exit(0);
    return;
  }

  console.log(`Seeding data for main user: ${mainUser.username} (${mainUser.email})`);

  // Create dummy users
  const dummyData = [
    { username: "alice_wonder", email: "alice@example.com", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=alice" },
    { username: "bob_builder", email: "bob@example.com", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=bob" },
    { username: "charlie_chaplin", email: "charlie@example.com", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=charlie" },
    { username: "david_bowie", email: "david@example.com", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=david" },
    { username: "eve_smith", email: "eve@example.com", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=eve" },
  ];

  const dummyUsers = [];
  for (const data of dummyData) {
    let user = await UserAccountModel.findOne({ email: data.email });
    if (!user) {
      user = await UserAccountModel.create(data);
    }
    dummyUsers.push(user);
  }
  
  console.log(`Ensured ${dummyUsers.length} dummy users exist.`);

  // Clean existing friendships for these dummies to avoid duplicate key errors
  await FriendshipModel.deleteMany({
    $or: [
      { requesterId: { $in: dummyUsers.map(u => u._id) } },
      { recipientId: { $in: dummyUsers.map(u => u._id) } }
    ]
  });

  console.log("Cleared old friendships involving dummy users.");

  // 1. Accepted Friends (Alice and Bob)
  await FriendshipModel.create({
    requesterId: mainUser._id,
    recipientId: dummyUsers[0]._id, // Alice
    status: "accepted"
  });
  await FriendshipModel.create({
    requesterId: dummyUsers[1]._id, // Bob
    recipientId: mainUser._id,
    status: "accepted"
  });

  // 2. Incoming Pending Requests (Charlie and David)
  await FriendshipModel.create({
    requesterId: dummyUsers[2]._id, // Charlie
    recipientId: mainUser._id,
    status: "pending"
  });
  await FriendshipModel.create({
    requesterId: dummyUsers[3]._id, // David
    recipientId: mainUser._id,
    status: "pending"
  });

  // 3. Outgoing Pending Request (Eve)
  await FriendshipModel.create({
    requesterId: mainUser._id,
    recipientId: dummyUsers[4]._id, // Eve
    status: "pending"
  });

  console.log("Successfully seeded friendships and requests!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
