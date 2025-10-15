import bcrypt from "bcrypt";

const hash = '$2b$10$3r53ScCUuWW5dZlQv/5Gw.f.ZVNUqdbn9pwOcdqaJiayQxdsf8Hk2';
const password = 'SuperAdmin123!';

async function test() {
  const result = await bcrypt.compare(password, hash);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('Match:', result);
}

test();