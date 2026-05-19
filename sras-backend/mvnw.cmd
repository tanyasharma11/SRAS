@echo off
setlocal

set "MVN_HOME=C:\Users\2494420\.m2\wrapper\dists\apache-maven-3.9.15-bin\4rlcemksed9vjmkvgss0jpc4po\apache-maven-3.9.15"
set "PATH=%MVN_HOME%\bin;%PATH%"

call "%MVN_HOME%\bin\mvn.cmd" %*
