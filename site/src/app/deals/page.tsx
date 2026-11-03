// R10 P1: Deals live inside the shop as a tab now; old links keep working
import { redirect } from 'next/navigation';
export default function Page() { redirect('/shop?scope=deals'); }
