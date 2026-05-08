import { jwtVerify, SignJWT } from "jose";

export type MemberJwtPayload = {
  member_id: string;
  session_id: string;
};

export type AdminJwtPayload = {
  admin_id: string;
  username: string;
};

const memberSecret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "");
const adminSecret = () => new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "");

export async function signMemberJwt(payload: MemberJwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(memberSecret());
}

export async function verifyMemberJwt(token: string): Promise<MemberJwtPayload> {
  const { payload } = await jwtVerify(token, memberSecret());
  return {
    member_id: String(payload.member_id),
    session_id: String(payload.session_id),
  };
}

export async function signAdminJwt(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(adminSecret());
}

export async function verifyAdminJwt(token: string): Promise<AdminJwtPayload> {
  const { payload } = await jwtVerify(token, adminSecret());
  return {
    admin_id: String(payload.admin_id),
    username: String(payload.username),
  };
}
