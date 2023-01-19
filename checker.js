async function runChecker() {
   const response = await fetch('http://localhost:3000/parser/check', {
      method: 'POST',
      headers: {
         key: 'sadfs8787sdfsjkksd'
      }
   })
   console.log(await response.text())
}
runChecker()