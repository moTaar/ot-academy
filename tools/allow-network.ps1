# Lets other devices on the network open CS Academy: adds an inbound Windows
# Firewall rule for the trainer's TCP port. Run it once with
#
#   start.bat allow-network
#
# Changing the firewall needs administrator rights, so Windows asks for them.
param(
  [string]$Node = 'node',
  [int]$Port = 0,
  [switch]$Elevated
)
$ErrorActionPreference = 'Stop'
$app = Split-Path -Parent $PSScriptRoot

function Finish([int]$code) {
  # The elevated window closes on exit; keep it open so its messages can be read.
  if ($Elevated) { Read-Host 'Press Enter to close' | Out-Null }
  exit $code
}

# Same port as server.js: config.json "port", overridden by OTA_PORT.
if (-not $Port) {
  $Port = 8420
  $cfg = Join-Path $app 'config.json'
  if (Test-Path $cfg) {
    try { $c = Get-Content $cfg -Raw | ConvertFrom-Json; if ($c.port) { $Port = [int]$c.port } }
    catch { Write-Host "config.json could not be read ($($_.Exception.Message)); using port $Port." }
  }
  if ($env:OTA_PORT) { $Port = [int]$env:OTA_PORT }
}
$cmd = Get-Command $Node -ErrorAction SilentlyContinue
$nodeExe = if ($cmd) { $cmd.Source } else { $null }

$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) {
  if ($Elevated) { Write-Host 'Administrator rights were not granted, so nothing was changed.'; Finish 1 }
  Write-Host 'Windows will ask for administrator rights to change the firewall...'
  $params = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$PSCommandPath`"", '-Port', $Port, '-Elevated')
  if ($nodeExe) { $params += @('-Node', "`"$nodeExe`"") }
  try { $p = Start-Process powershell.exe -Verb RunAs -Wait -PassThru -ArgumentList $params }
  catch { Write-Host 'Administrator rights were not granted, so nothing was changed.'; exit 1 }
  exit $p.ExitCode
}

try {
  $name = "CS Academy (TCP $Port)"
  # One rule only: drop rules left from an earlier port.
  Get-NetFirewallRule -DisplayName 'CS Academy (TCP *)' -ErrorAction SilentlyContinue | Remove-NetFirewallRule
  New-NetFirewallRule -DisplayName $name -Description 'Lets other devices on the network open the CS Academy trainer.' `
    -Direction Inbound -Action Allow -Protocol TCP -LocalPort $Port -Profile Any | Out-Null
  Write-Host "Added Windows Firewall rule `"$name`": other devices may connect to port $Port."

  # When Windows' "allow node.exe on this network?" prompt is cancelled it
  # creates Block rules for node.exe, and a Block rule beats any Allow rule.
  if ($nodeExe) {
    $blocking = @(Get-NetFirewallApplicationFilter |
      Where-Object { $_.Program -and [Environment]::ExpandEnvironmentVariables($_.Program) -ieq $nodeExe } |
      Get-NetFirewallRule |
      Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' })
    if ($blocking.Count) {
      Write-Host ''
      Write-Host "These firewall rules block $nodeExe and would still keep other devices out:"
      $blocking | ForEach-Object { Write-Host "  - $($_.DisplayName) [$($_.Profile)]" }
      if ((Read-Host 'Disable them? [y/N]') -match '^(y|yes)$') {
        $blocking | Disable-NetFirewallRule
        Write-Host 'Disabled.'
      } else {
        Write-Host 'Left as they are. You can disable them later in "Windows Defender Firewall with Advanced Security" > Inbound Rules.'
      }
    }
  }
  Write-Host ''
  Write-Host 'Start CS Academy with start.bat: it prints the addresses other devices can use.'
  Finish 0
} catch {
  Write-Host "Could not change the firewall: $($_.Exception.Message)"
  Finish 1
}
