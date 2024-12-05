using System.Text.RegularExpressions;

class Operation
{
    public int? Score { get; set; }
    public bool? Enable { get; set; }
    public bool Noop { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        var inputFile = Environment.GetEnvironmentVariable("INPUT") ?? "example";
        var input1 = File.ReadAllText(inputFile + "1");
        var part1Matches = Regex.Matches(input1, @"mul\((?<left>\d+),(?<right>\d+)\)");

        var part1 = part1Matches.Select(m =>
        {
            var left = int.Parse(m.Groups["left"].Value);
            var right = int.Parse(m.Groups["right"].Value);

            return left * right;
        }).Sum();

        Console.Out.WriteLine($"Part1 Result: {part1}");

        var input2 = File.ReadAllText(inputFile + "2");
        var part2Matches = Regex.Matches(input2, @"(?:(?<op>mul)\((?<left>\d+),(?<right>\d+)\))|(?:(?<op>do)\(\)|(?:(?<op>don't)\(\)))");
        var part2 = part2Matches.Select(m =>
        {
            var op = m.Groups["op"].Value;
            Operation operation;

            switch (op)
            {
                case "mul":
                    var left = int.Parse(m.Groups["left"].Value);
                    var right = int.Parse(m.Groups["right"].Value);

                    operation = new Operation
                    {
                        Score = left * right,
                    };
                    break;
                case "do":
                    operation = new Operation
                    {
                        Enable = true
                    };
                    break;
                case "don't":
                    operation = new Operation
                    {
                        Enable = false
                    };
                    break;
                default:
                    operation = new Operation
                    {
                        Noop = true
                    };
                    break;
            }

            return operation;
        }).Aggregate(new Operation { Enable = true, Score = 0 }, (accum, current) =>
        {
            if (current.Enable.HasValue)
            {
                accum.Enable = current.Enable.Value;
                return accum;
            }

            if (current.Score.HasValue && accum.Enable.Value)
            {
                accum.Score += current.Score;
                return accum;
            }

            return accum;
        });

        Console.Out.WriteLine($"Part2 Result: {part2.Score}");
    }
}
