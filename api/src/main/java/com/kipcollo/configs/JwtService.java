package com.kipcollo.configs;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {

  // @Value("${application.security.security.jwt.expiration}")
   private long jwtExpiration = 864000 ;
  // @Value("${application.security.jwt.secret-key}")
   private String secretKey = "ea1093218a4f76e23c8c037c7525d35e9a664abf19169a7ebb50664167a433bf81efec2d952f9d51523f1aefe188f86bdf41c2eb9a45fa960f097233f8e46eea5d5ec72d86a55f43d9ac5cd46b9525b2e61497710cef5c84b8eadcd00bce5d13f974561f38590684b16e88f985e921c79a49f41e4580109d2fdc4bc39753d97634bcb8b64acf89eaf80fdadbf73e357bdcb4d82fb2a48ca2fd81cd3adc4d74d9ff90b22162db037cb73e20ca3c190633bf2e3b1b1226721a8a765eab40b6ef15cc50c675dcc7c9d5e8aaffd89fb4bf8034e2724ba9443aa7375ead0063a9453745271bcd0e89661091134f924219fbb8b51bf64adfcaff83611739288ad02975";

  public String generateToken(UserDetails userDetails){
     return generateToken(new HashMap<>(), userDetails);
  }

  public String generateToken(Map<String, Object> claims,UserDetails userDetails){
     return buildToken(claims, userDetails, jwtExpiration);
  }

  public String extractUsername(String token){
     return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
     final Claims claims = extractAllClaims(token);
     return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token){
     return Jwts
             .parser()
             .verifyWith(getSignInKey())
             .build()
             .parseSignedClaims(token)
             .getPayload();
  }
  private String buildToken(Map<String, Object> extraClaims,UserDetails userDetails,long jwtExpiration){
     var authorities = userDetails.getAuthorities()
                 .stream()
                 .map(GrantedAuthority::getAuthority)
                 .toList();

     return Jwts
              .builder()
              .claims(extraClaims)
              .subject(userDetails.getUsername())
              .issuedAt(new Date(System.currentTimeMillis()))
              .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
              .claim("authorities", authorities)
              .signWith(getSignInKey())
              .compact();

  }

  public boolean isTokenValid(String token,UserDetails userDetails){
     final String username = extractUsername(token);
     return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token){
     return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token){
     return extractClaim(token, Claims::getExpiration);
  }

  private SecretKey getSignInKey(){
     byte[] keyBytes = Decoders.BASE64.decode(secretKey);
     return Keys.hmacShaKeyFor(keyBytes);
  }


}
