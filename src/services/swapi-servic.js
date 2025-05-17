export default async function getResourse(url) {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTBhYmU4Njk5MTM0M2I2OGViMzkxOTdkMDc1YjM4MSIsIm5iZiI6MTc0NTY4OTE1My45NjYsInN1YiI6IjY4MGQxYTQxNzFkZWRjYjhhY2VhYjdjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w-TG7uj-ySI6DaATbIizi4u8TcNiKMwsNDW-2dG-wYw'
  );

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  try {
    const result = await fetch(url, requestOptions);

    if (!result.ok) throw new Error(result.statusText); // .then((response) => response.json());
    return await result.json();
  } catch (err) {
    console.error(`Fetch error`);
    return null;
  }
}
