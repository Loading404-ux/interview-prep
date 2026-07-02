#include <stdio.h>
#include <math.h>
int main()
{
    int n = 11;
    int flag = 0;
    for (int i =2; i < sqrt(n); i++)
    {
        if (n % i == 0)
        {
            flag = 1;
            break;
        }
    }
    if (flag == 0)
    {
        printf("prime");
    }
    else
    {
        printf("not prime");
    }
    return 0;
}