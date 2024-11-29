import { supabase } from "@/supabase";

export default async function Home() {
        const {data, error} = await supabase.from('products').select()
        if (error) {
                console.error(error)
        } else {
                console.log(data);
                
        }


        
        
  return (
    <>
        <h1>Bonjoir</h1>
    </>
  );
}
