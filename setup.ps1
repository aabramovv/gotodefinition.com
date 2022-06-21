# Credits to https://gist.github.com/hlkiltas/1b9ba96101e820660776a1bad1f880fd

$files = Get-ChildItem "*.html" -Recurse

$find = 'D:/GoToDefinition/gotodefinition.com'

$replace = Get-Location

Get-ChildItem $files -Recurse |
select -ExpandProperty fullname |
foreach {
     If(Select-String -Path $_ -SimpleMatch $find -quiet){
          (Get-Content $_) |
          ForEach-Object {$_ -replace $find, $replace } |
              Set-Content $_ 
              write-host "File Changed : " $_
          } 
     }